-- CreateTable
CREATE TABLE "super-admin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePhoto" TEXT NOT NULL,
    "contactNumber" VARCHAR(30) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "super-admin_id_key" ON "super-admin"("id");

-- CreateIndex
CREATE UNIQUE INDEX "super-admin_userId_key" ON "super-admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "super-admin_email_key" ON "super-admin"("email");

-- CreateIndex
CREATE INDEX "super-admin_email_idx" ON "super-admin"("email");

-- CreateIndex
CREATE INDEX "super-admin_isDeleted_idx" ON "super-admin"("isDeleted");

-- AddForeignKey
ALTER TABLE "super-admin" ADD CONSTRAINT "super-admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
