-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('available', 'reserved', 'sold');

-- CreateEnum
CREATE TYPE "Disposition" AS ENUM ('front', 'back', 'lateral');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'ARS');

-- CreateEnum
CREATE TYPE "InstallmentStatus" AS ENUM ('pendiente', 'pagada', 'vencida');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('superadmin', 'user');

-- CreateTable
CREATE TABLE "typologies" (
    "id" UUID NOT NULL,
    "firestore_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "typologies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" UUID NOT NULL,
    "firestore_id" TEXT,
    "unit_number" TEXT NOT NULL,
    "typology_id" UUID,
    "floor" INTEGER NOT NULL,
    "status" "PropertyStatus" NOT NULL DEFAULT 'available',
    "price" DECIMAL(12,2),
    "area" DECIMAL(8,2),
    "disposition" "Disposition",
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_images" (
    "id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "public_id" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "property_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "firestore_id" TEXT,
    "firebase_uid" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agencies" (
    "id" UUID NOT NULL,
    "firestore_id" TEXT,
    "name" TEXT NOT NULL,
    "logo_url" TEXT,
    "logo_public_id" TEXT,
    "phone" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" UUID NOT NULL,
    "firestore_id" TEXT,
    "name" TEXT NOT NULL,
    "logo_url" TEXT,
    "logo_public_id" TEXT,
    "website" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales" (
    "id" UUID NOT NULL,
    "firestore_id" TEXT,
    "property_id" UUID NOT NULL,
    "agent_id" UUID,
    "agency_id" UUID,
    "buyer_name" TEXT NOT NULL,
    "buyer_last_name" TEXT NOT NULL,
    "buyer_dni" TEXT NOT NULL,
    "buyer_phone" TEXT,
    "buyer_email" TEXT,
    "closing_value" DECIMAL(12,2) NOT NULL,
    "currency" "Currency" NOT NULL,
    "delivery_percentage" DECIMAL(5,2),
    "delivery_amount" DECIMAL(12,2),
    "installment_count" INTEGER,
    "installments_balance" DECIMAL(12,2),
    "installment_base_amount" DECIMAL(12,2),
    "updatable_index" BOOLEAN NOT NULL DEFAULT false,
    "index_type" TEXT,
    "boleto_date" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "installments" (
    "id" UUID NOT NULL,
    "firestore_id" TEXT,
    "sale_id" UUID NOT NULL,
    "number" INTEGER NOT NULL,
    "due_date" DATE NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "InstallmentStatus" NOT NULL DEFAULT 'pendiente',
    "payment_date" DATE,
    "applied_percentage" DECIMAL(6,4),

    CONSTRAINT "installments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" UUID NOT NULL,
    "firestore_id" TEXT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT,
    "uploaded_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_updates" (
    "id" UUID NOT NULL,
    "firestore_id" TEXT,
    "date" DATE NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "video_url" TEXT,
    "youtube_id" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_images" (
    "id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "typologies_firestore_id_key" ON "typologies"("firestore_id");

-- CreateIndex
CREATE UNIQUE INDEX "properties_firestore_id_key" ON "properties"("firestore_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_firestore_id_key" ON "users"("firestore_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_firebase_uid_key" ON "users"("firebase_uid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "agencies_firestore_id_key" ON "agencies"("firestore_id");

-- CreateIndex
CREATE UNIQUE INDEX "brands_firestore_id_key" ON "brands"("firestore_id");

-- CreateIndex
CREATE UNIQUE INDEX "sales_firestore_id_key" ON "sales"("firestore_id");

-- CreateIndex
CREATE UNIQUE INDEX "installments_firestore_id_key" ON "installments"("firestore_id");

-- CreateIndex
CREATE UNIQUE INDEX "installments_sale_id_number_key" ON "installments"("sale_id", "number");

-- CreateIndex
CREATE UNIQUE INDEX "files_firestore_id_key" ON "files"("firestore_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_updates_firestore_id_key" ON "project_updates"("firestore_id");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_typology_id_fkey" FOREIGN KEY ("typology_id") REFERENCES "typologies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installments" ADD CONSTRAINT "installments_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;
