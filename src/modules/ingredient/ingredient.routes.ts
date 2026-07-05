import { Router } from "express";
import {
  getAllIngredients,
  getIngredientIdByPublicId,
  updateIngredientImage,
  upsertIngredient,
} from "./ingredient.service";
import type { AuthRequest } from "../../types";
import type { InsertPublicIngredient } from "../../db/schemas/ingredient.schema";
import { insertIngredientSchema } from "./ingredient.validation";
import { randomUUID } from "node:crypto";
import {
  getImageExtension,
  getPresignedImageUploadPost,
  getPublicObjectUrl,
  isAllowedImageContentType,
} from "../../lib/s3/s3.service";
import { presignRateLimiter } from "../../lib/s3/presign-rate-limiter";
import { BucketNames } from "../../lib/s3/s3-client.ts";

export const ingredientRouter = Router();

ingredientRouter.get("/", async (req: AuthRequest, res) => {
  if (!req.userId) {
    res.status(401).json({ success: false, error: "Invalid user ID" });
    return;
  }

  try {
    const ingredients = await getAllIngredients(req.userId);
    res.json({ success: true, data: ingredients });
  } catch (error) {
    console.error("Failed to get ingredients", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

ingredientRouter.post(
  "/",
  async (
    req: AuthRequest<unknown, unknown, { ingredient: InsertPublicIngredient }>,
    res,
  ) => {
    if (!req.userId) {
      res.status(401).json({ success: false, error: "Invalid user ID" });
      return;
    }

    const { data, error } = insertIngredientSchema.safeParse(req.body);
    if (error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    try {
      const ingredient = await upsertIngredient(data.ingredient, req.userId);
      res.json({ success: true, data: ingredient[0] });
    } catch (error) {
      console.error("Failed to save new ingredient", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to save new ingredient" });
    }
  },
);

// Step 1: client requests a presigned upload slot for this ingredient's
// image. S3/MinIO enforces the size/content-type conditions itself.
ingredientRouter.post(
  "/:ingredientPublicId/image/presign",
  presignRateLimiter,
  async (
    req: AuthRequest<
      { ingredientPublicId: string },
      unknown,
      { contentType: string }
    >,
    res,
  ) => {
    if (!req.userId) {
      res.status(401).json({ success: false, error: "Invalid user ID" });
      return;
    }

    const { contentType } = req.body;
    if (!isAllowedImageContentType(contentType)) {
      res
        .status(400)
        .json({ success: false, error: "Unsupported image content type" });
      return;
    }

    try {
      const ingredientId = await getIngredientIdByPublicId(
        req.params.ingredientPublicId,
        req.userId,
      );
      if (!ingredientId) {
        res.status(404).json({ success: false, error: "Ingredient not found" });
        return;
      }

      const key = `${randomUUID()}.${getImageExtension(contentType)}`;

      const { url, fields } = await getPresignedImageUploadPost({
        bucketName: BucketNames.INGREDIENTS,
        key,
        contentType,
      });

      res.json({
        success: true,
        data: {
          url,
          fields,
          publicUrl: getPublicObjectUrl(BucketNames.INGREDIENTS, key),
        },
      });
    } catch (error) {
      console.error(
        "Failed to generate presigned ingredient image upload",
        error,
      );
      res.status(500).json({
        success: false,
        error: "Failed to generate presigned upload",
      });
    }
  },
);

// Step 2 (after the client uploads directly to S3/MinIO): persist the
// resulting public URL onto the ingredient.
ingredientRouter.patch(
  "/:ingredientPublicId/image",
  async (
    req: AuthRequest<
      { ingredientPublicId: string },
      unknown,
      { image: string }
    >,
    res,
  ) => {
    if (!req.userId) {
      res.status(401).json({ success: false, error: "Invalid user ID" });
      return;
    }

    const { image } = req.body;
    if (!image) {
      res.status(400).json({ success: false, error: "Missing image URL" });
      return;
    }

    try {
      const updatedIngredient = await updateIngredientImage({
        ingredientPublicId: req.params.ingredientPublicId,
        userId: req.userId,
        image,
      });

      if (!updatedIngredient) {
        res.status(404).json({ success: false, error: "Ingredient not found" });
        return;
      }

      res.json({ success: true, data: updatedIngredient });
    } catch (error) {
      console.error("Failed to update ingredient image", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to update ingredient image" });
    }
  },
);