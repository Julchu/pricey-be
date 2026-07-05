import { Router } from "express";
import {
  deleteRecipe,
  getAllRecipes,
  getRecipe,
  insertRecipe,
  updateRecipe,
  updateRecipeImage,
} from "./recipe.service";
import type { AuthRequest } from "../../types";
import type { InsertPublicRecipe } from "../../db/schemas/recipe.schema";
import type { InsertPublicRecipeIngredient } from "../../db/schemas/recipe-ingredient.schema";
import { randomUUID } from "node:crypto";
import {
  getImageExtension,
  getPresignedImageUploadPost,
  getPublicObjectUrl,
  isAllowedImageContentType,
} from "../../lib/s3/s3.service";
import { presignRateLimiter } from "../../lib/s3/presign-rate-limiter";
import { BucketNames } from "../../lib/s3/s3-client.ts";

export const recipeRouter = Router();

recipeRouter.get("/", async (req: AuthRequest, res) => {
  if (!req.userId) {
    res.status(401).json({ success: false, error: "Invalid user ID" });
    return;
  }

  try {
    const recipes = await getAllRecipes(req.userId);
    res.json({ success: true, data: recipes });
  } catch (error) {
    console.error("Failed to get recipes", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

recipeRouter.get(
  "/:recipeId",
  async (req: AuthRequest<{ recipeId: string }>, res) => {
    if (!req.userId) {
      res.status(401).json({ success: false, error: "Invalid user ID" });
      return;
    }

    try {
      const recipe = await getRecipe(req.params.recipeId, req.userId);

      if (!recipe) {
        res.status(404).json({ success: false });
        return;
      }

      res.json({
        success: true,
        data: recipe,
      });
    } catch (error) {
      console.error("Failed to get recipe", error);
      res.status(500).json({ success: false, error: "Failed to get recipe" });
    }
  },
);

recipeRouter.post(
  "/",
  async (
    req: AuthRequest<
      unknown,
      unknown,
      {
        recipe: InsertPublicRecipe & {
          ingredients: InsertPublicRecipeIngredient[];
        };
      }
    >,
    res,
  ) => {
    if (!req.userId) {
      res.status(401).json({ success: false, error: "Invalid user ID" });
      return;
    }

    // TODO: Add zod schema validation
    const { ingredients, ...newRecipe } = req.body.recipe;

    try {
      const recipe = await insertRecipe({
        recipe: newRecipe,
        recipeIngredients: ingredients,
        userId: req.userId,
      });

      if (!recipe) {
        res.json({ success: false, error: "Recipe does not exist" });
        return;
      }

      res.json({ success: true, data: recipe });
    } catch (error) {
      console.error("Failed to save new recipe", error);
      res.status(500).json({
        success: false,
        error: "Failed to save new recipe",
      });
    }
  },
);

recipeRouter.patch(
  "/:recipePublicId",
  async (
    req: AuthRequest<
      { recipePublicId: string },
      unknown,
      {
        recipe: InsertPublicRecipe;
        deletedIngredientIds: string[];
        newIngredients: InsertPublicRecipeIngredient[];
        updatedIngredients: InsertPublicRecipeIngredient[];
      }
    >,
    res,
  ) => {
    if (!req.userId) {
      res.status(401).json({ success: false, error: "Invalid user ID" });
      return;
    }
    try {
      const recipePublicId = req.params.recipePublicId;
      const recipe = req.body.recipe;
      const deletedIngredientIds = req.body.deletedIngredientIds;
      const newIngredients = req.body.newIngredients;
      const updatedIngredients = req.body.updatedIngredients;
      const userId = req.userId;

      const updatedRecipe = await updateRecipe({
        recipePublicId,
        recipe,
        deletedIngredientIds,
        newIngredients,
        updatedIngredients,
        userId,
      });

      if (!updatedRecipe) {
        res.status(404).json({
          success: false,
          error: "Recipe could not be updated",
        });
        return;
      }

      res.json({
        success: true,
        data: updatedRecipe,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: `Failed to update recipe: ${error}`,
      });
    }
  },
);

recipeRouter.delete(
  "/:recipePublicId",
  async (req: AuthRequest<{ recipePublicId: string }>, res) => {
    if (!req.userId) {
      res.status(401).json({ success: false, error: "Invalid user ID" });
      return;
    }

    try {
      const deletedRecipeId = await deleteRecipe(
        req.params.recipePublicId,
        req.userId,
      );

      if (!deletedRecipeId) {
        res.status(404).json({
          success: false,
          error: "Recipe does not exist",
        });
        return;
      }

      res.json({
        success: true,
        data: deletedRecipeId.publicId,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: `Failed to delete recipe: ${error}`,
      });
    }
  },
);

// Step 1: client requests a presigned upload slot for this recipe's photo.
// S3/MinIO enforces the size/content-type conditions itself.
recipeRouter.post(
  "/:recipePublicId/image/presign",
  presignRateLimiter,
  async (
    req: AuthRequest<
      { recipePublicId: string },
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
      const recipe = await getRecipe(req.params.recipePublicId, req.userId);
      if (!recipe) {
        res.status(404).json({ success: false, error: "Recipe not found" });
        return;
      }

      const key = `${randomUUID()}.${getImageExtension(contentType)}`;

      const { url, fields } = await getPresignedImageUploadPost({
        bucketName: BucketNames.RECIPES,
        key,
        contentType,
      });

      res.json({
        success: true,
        data: {
          url,
          fields,
          publicUrl: getPublicObjectUrl(BucketNames.RECIPES, key),
        },
      });
    } catch (error) {
      console.error("Failed to generate presigned recipe image upload", error);
      res.status(500).json({
        success: false,
        error: "Failed to generate presigned upload",
      });
    }
  },
);

// Step 2 (after the client uploads directly to S3/MinIO): persist the
// resulting public URL onto the recipe.
recipeRouter.patch(
  "/:recipePublicId/image",
  async (
    req: AuthRequest<{ recipePublicId: string }, unknown, { image: string }>,
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
      const updatedRecipe = await updateRecipeImage({
        recipePublicId: req.params.recipePublicId,
        userId: req.userId,
        image,
      });

      if (!updatedRecipe) {
        res.status(404).json({ success: false, error: "Recipe not found" });
        return;
      }

      res.json({ success: true, data: updatedRecipe });
    } catch (error) {
      console.error("Failed to update recipe image", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to update recipe image" });
    }
  },
);