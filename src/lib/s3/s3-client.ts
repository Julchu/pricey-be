import { S3Client } from "@aws-sdk/client-s3";

// S3_ENDPOINT is only set locally (pointed at MinIO). Leaving it unset in
// staging/production lets the AWS SDK talk to real S3's regional endpoint.
const endpoint = process.env.S3_ENDPOINT;

// Module-level singleton: this file's body only runs once per process, so
// every module that imports `s3Client` shares the same instance (same
// pattern as the `db` export in db/index.ts).
export const s3Client = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  endpoint,
  // MinIO requires path-style addressing (bucket in the path, not the
  // hostname). Real S3 supports both, so this only needs to be true locally.
  forcePathStyle: !!endpoint,
  // Only override credentials when explicitly provided (MinIO). In
  // staging/production, omitting this lets the SDK fall back to its default
  // credential chain (IAM role, env vars set by AWS, etc.).
  ...(process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY && {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    }),
});

export const BucketNames = {
  INGREDIENTS: "ingredients",
  RECIPES: "recipes",
  USERS: "users",
} as const;

export type BucketName = (typeof BucketNames)[keyof typeof BucketNames];