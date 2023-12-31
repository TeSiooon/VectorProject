BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Image] DROP CONSTRAINT [Image_isAvatar_df];
ALTER TABLE [dbo].[Image] ADD CONSTRAINT [Image_isAvatar_df] DEFAULT 0 FOR [isAvatar];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
