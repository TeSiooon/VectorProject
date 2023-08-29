/*
  Warnings:

  - You are about to drop the `FriendRequest` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[FriendRequest] DROP CONSTRAINT [FriendRequest_fromUserId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[FriendRequest] DROP CONSTRAINT [FriendRequest_toUserId_fkey];

-- DropTable
DROP TABLE [dbo].[FriendRequest];

-- CreateTable
CREATE TABLE [dbo].[Request] (
    [id] INT NOT NULL IDENTITY(1,1),
    [fromUserId] INT NOT NULL,
    [toUserId] INT NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Request_status_df] DEFAULT 'oczekujace',
    CONSTRAINT [Request_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Request] ADD CONSTRAINT [Request_fromUserId_fkey] FOREIGN KEY ([fromUserId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Request] ADD CONSTRAINT [Request_toUserId_fkey] FOREIGN KEY ([toUserId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
