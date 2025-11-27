/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `tattoos` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `tattoos` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `tattoos` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `tattoos` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `tattoos` table. All the data in the column will be lost.
  - Added the required column `artist` to the `tattoos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficulty` to the `tattoos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedPrice` to the `tattoos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedTime` to the `tattoos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `tattoos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "imageUrl",
ADD COLUMN     "discountPrice" DOUBLE PRECISION,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "specifications" JSONB;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "service" TEXT;

-- AlterTable
ALTER TABLE "tattoos" DROP COLUMN "duration",
DROP COLUMN "imageUrl",
DROP COLUMN "isActive",
DROP COLUMN "price",
DROP COLUMN "title",
ADD COLUMN     "artist" TEXT NOT NULL,
ADD COLUMN     "colors" TEXT[],
ADD COLUMN     "difficulty" TEXT NOT NULL,
ADD COLUMN     "estimatedPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "estimatedTime" TEXT NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" TEXT;
