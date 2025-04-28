-- DropForeignKey
ALTER TABLE "artworks" DROP CONSTRAINT "artworks_exhibitionId_fkey";

-- DropForeignKey
ALTER TABLE "exhibitions" DROP CONSTRAINT "exhibitions_userId_fkey";

-- AlterTable
ALTER TABLE "artworks" ADD COLUMN     "userId" TEXT,
ALTER COLUMN "url" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "exhibitions" ADD CONSTRAINT "exhibitions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "exhibitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
