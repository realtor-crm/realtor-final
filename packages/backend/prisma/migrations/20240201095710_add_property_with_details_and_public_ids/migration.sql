/*
  Warnings:

  - A unique constraint covering the columns `[public_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `public_id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('FOR_SALE', 'FOR_RENT');

-- CreateEnum
CREATE TYPE "Garden" AS ENUM ('FRONT', 'BACK', 'BOTH', 'SIDE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "public_id" TEXT NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL;

-- CreateTable
CREATE TABLE "Property" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "addressId" INTEGER NOT NULL,
    "propertyDetailsId" INTEGER,
    "pricingId" INTEGER,
    "landDetailsId" INTEGER,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyDetails" (
    "id" SERIAL NOT NULL,
    "livableArea" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "PropertyDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandDetails" (
    "id" SERIAL NOT NULL,
    "landArea" DECIMAL(65,30) NOT NULL,
    "sillLevel" DECIMAL(65,30) NOT NULL,
    "garden" "Garden" NOT NULL,

    CONSTRAINT "LandDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pricing" (
    "id" SERIAL NOT NULL,
    "askingPrice" DECIMAL(65,30) NOT NULL,
    "deposit" DECIMAL(65,30) NOT NULL,
    "utilities" DECIMAL(65,30) NOT NULL,
    "hoaFees" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "houseNumber" TEXT NOT NULL,
    "apartmentNumber" TEXT,
    "floor" INTEGER,
    "landRegistryNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Property_public_id_key" ON "Property"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_public_id_key" ON "User"("public_id");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_propertyDetailsId_fkey" FOREIGN KEY ("propertyDetailsId") REFERENCES "PropertyDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_pricingId_fkey" FOREIGN KEY ("pricingId") REFERENCES "Pricing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_landDetailsId_fkey" FOREIGN KEY ("landDetailsId") REFERENCES "LandDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;
