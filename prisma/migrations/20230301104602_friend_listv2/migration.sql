BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[FriendRequest] (
    [id] INT NOT NULL IDENTITY(1,1),
    [fromUserId] INT NOT NULL,
    [toUserId] INT NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [FriendRequest_status_df] DEFAULT 'oczekujace',
    CONSTRAINT [FriendRequest_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[FriendRequest] ADD CONSTRAINT [FriendRequest_fromUserId_fkey] FOREIGN KEY ([fromUserId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[FriendRequest] ADD CONSTRAINT [FriendRequest_toUserId_fkey] FOREIGN KEY ([toUserId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
