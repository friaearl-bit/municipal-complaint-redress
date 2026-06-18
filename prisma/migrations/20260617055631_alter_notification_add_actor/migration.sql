-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'TASK', 'COMPLAINT', 'SYSTEM');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "actorId" INTEGER,
ADD COLUMN     "type" "NotificationType" NOT NULL DEFAULT 'INFO';

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");
