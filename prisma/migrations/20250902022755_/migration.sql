/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `posts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `readTime` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."posts_slug_key";

-- AlterTable
ALTER TABLE "public"."posts" ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "readTime" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."tags" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_PostTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PostTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "public"."tags"("name");

-- CreateIndex
CREATE INDEX "_PostTags_B_index" ON "public"."_PostTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "posts_title_key" ON "public"."posts"("title");

-- AddForeignKey
ALTER TABLE "public"."_PostTags" ADD CONSTRAINT "_PostTags_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PostTags" ADD CONSTRAINT "_PostTags_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
