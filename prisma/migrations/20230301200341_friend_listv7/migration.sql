/*
  Warnings:

  - You are about to drop the `FriendList` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[FriendList] DROP CONSTRAINT [FriendList_userId_fkey];

-- DropTable
DROP TABLE [dbo].[FriendList];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
