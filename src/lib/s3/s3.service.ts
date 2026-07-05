import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { type BucketName, s3Client } from "./s3-client";

const DEFAULT_PRESIGNED_URL_EXPIRY_SECONDS = 900; // 15 minutes

// Enforced by S3/MinIO itself via the POST policy's content-length-range
// condition -- not just an app-level suggestion. An upload outside this
// range is rejected by the storage layer before the object is written.
export const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024; // 10 MB
export const MIN_IMAGE_UPLOAD_BYTES = 1;

export const ALLOWED_IMAGE_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedImageContentType =
  (typeof ALLOWED_IMAGE_CONTENT_TYPES)[number];

export const isAllowedImageContentType = (
  contentType: unknown,
): contentType is AllowedImageContentType =>
  typeof contentType === "string" &&
  ALLOWED_IMAGE_CONTENT_TYPES.includes(contentType as AllowedImageContentType);

// image/jpeg -> jpeg, etc. Used to build a sensible object key extension.
export const getImageExtension = (contentType: AllowedImageContentType) =>
  contentType.split("/")[1];

/**
 * Generates a short-lived URL the client can PUT the file to directly,
 * bypassing the backend entirely.
 *
 * NOTE: presigned PUT URLs cannot enforce a max file size -- S3/MinIO will
 * accept whatever the client sends. Use `getPresignedImageUploadPost` for
 * user-uploaded images, which enforces size/content-type at the storage
 * layer via a presigned POST policy.
 */
export const getPresignedUploadUrl = async ({
  key,
  contentType,
  expiresInSeconds = DEFAULT_PRESIGNED_URL_EXPIRY_SECONDS,
  bucketName,
}: {
  key: string;
  contentType?: string;
  expiresInSeconds?: number;
  bucketName: BucketName;
}) => {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });
    return await getSignedUrl(s3Client, command, {
      expiresIn: expiresInSeconds,
    });
  } catch (error) {
    throw new Error("Error generating presigned upload URL:", {
      cause: error,
    });
  }
};

/**
 * Generates a presigned POST policy for user-uploaded images. Unlike
 * `getPresignedUploadUrl` (PUT), S3/MinIO enforces the content-length-range
 * and content-type conditions itself -- an oversized or wrong-type upload
 * is rejected by the storage layer, not just by app logic.
 *
 * The frontend must submit this as multipart/form-data: append every entry
 * in `fields` first, then append the file itself last under the "file"
 * field name, and POST to `url`.
 */
export const getPresignedImageUploadPost = async ({
  key,
  contentType,
  maxBytes = MAX_IMAGE_UPLOAD_BYTES,
  expiresInSeconds = DEFAULT_PRESIGNED_URL_EXPIRY_SECONDS,
  bucketName,
}: {
  key: string;
  contentType: AllowedImageContentType;
  maxBytes?: number;
  expiresInSeconds?: number;
  bucketName: BucketName;
}) => {
  try {
    return await createPresignedPost(s3Client, {
      Bucket: bucketName,
      Key: key,
      Conditions: [
        ["content-length-range", MIN_IMAGE_UPLOAD_BYTES, maxBytes],
        { "Content-Type": contentType },
      ],
      Fields: {
        "Content-Type": contentType,
      },
      Expires: expiresInSeconds,
    });
  } catch (error) {
    throw new Error("Error generating presigned image upload post:", {
      cause: error,
    });
  }
};

/**
 * Builds a plain, permanent URL for a public-read object. Only valid if the
 * bucket policy grants public read access to this key's prefix. This is
 * what gets stored in the `image` varchar columns.
 */
export const getPublicObjectUrl = (bucketName: BucketName, key: string) => {
  const endpoint = process.env.S3_ENDPOINT;

  if (endpoint) {
    // MinIO path-style URL: http://localhost:9000/<bucket>/<key>
    return `${endpoint}/${bucketName}/${key}`;
  }

  const region = process.env.S3_REGION || "us-east-1";
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
};

/**
 * Extracts the object key from a public URL previously built by
 * `getPublicObjectUrl`. Returns null if the URL does not contain the bucket
 * name (e.g. a legacy value or an external URL), so callers can skip the
 * delete gracefully.
 */
export const getObjectKeyFromUrl = (
  bucketName: BucketName,
  url: string,
): string | null => {
  const marker = `/${bucketName}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
};

export const deleteObject = async (bucketName: BucketName, key: string) => {
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      }),
    );
  } catch (error) {
    throw new Error("Error deleting object from S3:", { cause: error });
  }
};