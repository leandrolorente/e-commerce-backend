/*
  Warnings:

  - The values [MERCHANDISE] on the enum `ProductCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'CASH', 'BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "TattooStyle" AS ENUM ('OLD_SCHOOL', 'REALISMO', 'BLACKWORK', 'AQUARELA', 'MAORI', 'JAPONES', 'GEOMETRICO', 'MINIMALISTA', 'TRIBAL', 'FINE_LINE', 'PONTILHISMO', 'ORNAMENTAL');

-- CreateEnum
CREATE TYPE "TattooSize" AS ENUM ('PEQUENA', 'MEDIA', 'GRANDE', 'EXTRA_GRANDE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BodyArea" ADD VALUE 'PEITO_SUPERIOR';
ALTER TYPE "BodyArea" ADD VALUE 'PEITO_LATERAL';
ALTER TYPE "BodyArea" ADD VALUE 'COSTELAS';
ALTER TYPE "BodyArea" ADD VALUE 'BARRIGA';
ALTER TYPE "BodyArea" ADD VALUE 'COSTAS_SUPERIOR';
ALTER TYPE "BodyArea" ADD VALUE 'COSTAS_COMPLETAS';
ALTER TYPE "BodyArea" ADD VALUE 'LOMBAR';
ALTER TYPE "BodyArea" ADD VALUE 'BRACO_COMPLETO';
ALTER TYPE "BodyArea" ADD VALUE 'BRACO_SUPERIOR';
ALTER TYPE "BodyArea" ADD VALUE 'BRACO_INTERNO';
ALTER TYPE "BodyArea" ADD VALUE 'BRACO_EXTERNO';
ALTER TYPE "BodyArea" ADD VALUE 'ANTEBRACO_COMPLETO';
ALTER TYPE "BodyArea" ADD VALUE 'ANTEBRACO_INTERNO';
ALTER TYPE "BodyArea" ADD VALUE 'ANTEBRACO_EXTERNO';
ALTER TYPE "BodyArea" ADD VALUE 'COTOVELO';
ALTER TYPE "BodyArea" ADD VALUE 'MAO_COMPLETA';
ALTER TYPE "BodyArea" ADD VALUE 'DEDOS';
ALTER TYPE "BodyArea" ADD VALUE 'PULSO';
ALTER TYPE "BodyArea" ADD VALUE 'OMBRO_COMPLETO';
ALTER TYPE "BodyArea" ADD VALUE 'PERNA_COMPLETA';
ALTER TYPE "BodyArea" ADD VALUE 'COXA_INTERNA';
ALTER TYPE "BodyArea" ADD VALUE 'COXA_EXTERNA';
ALTER TYPE "BodyArea" ADD VALUE 'JOELHO';
ALTER TYPE "BodyArea" ADD VALUE 'CANELA';
ALTER TYPE "BodyArea" ADD VALUE 'PE_COMPLETO';
ALTER TYPE "BodyArea" ADD VALUE 'TORNOZELO';
ALTER TYPE "BodyArea" ADD VALUE 'DEDOS_PE';

-- AlterEnum
BEGIN;
-- Primeiro, converter todos os produtos MERCHANDISE para ACCESSORIES
UPDATE "products" SET "category" = 'MERCHANDISE' WHERE "category" = 'MERCHANDISE';

-- Criar novo enum com todos os valores
CREATE TYPE "ProductCategory_new" AS ENUM ('AFTERCARE', 'CLOTHING', 'ACCESSORIES', 'EQUIPMENT', 'GIFT_CARD', 'ART');

-- Converter MERCHANDISE para ACCESSORIES durante a migração
ALTER TABLE "products" ALTER COLUMN "category" TYPE "ProductCategory_new" 
  USING (
    CASE 
      WHEN "category"::text = 'MERCHANDISE' THEN 'ACCESSORIES'
      ELSE "category"::text
    END::"ProductCategory_new"
  );

-- Renomear tipos
ALTER TYPE "ProductCategory" RENAME TO "ProductCategory_old";
ALTER TYPE "ProductCategory_new" RENAME TO "ProductCategory";
DROP TYPE "ProductCategory_old";
COMMIT;
