/*
  Warnings:

  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Permission" DROP CONSTRAINT "Permission_roleId_fkey";

-- DropTable
DROP TABLE "public"."Permission";
