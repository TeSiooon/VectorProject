/*
  Warnings:

  - You are about to alter the column `dateOfBirth` on the `User` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `DateTime2`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[User] ALTER COLUMN [dateOfBirth] DATETIME2 NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
