using Amazon.S3;
using Amazon.S3.Transfer;
using Core.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Core.Services.Imp
{
    public class StorageService(IAmazonS3 s3Client, IConfiguration config) : IStorageService
    {
        private readonly string _bucketName = config["SupabaseS3:BucketName"]!;

        public async Task<string> UploadImageAsync(IFormFile file, string folder)
        {
            var fileKey = $"{folder}/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            using var newStream = new MemoryStream();
            await file.CopyToAsync(newStream);

            var uploadRequest = new TransferUtilityUploadRequest
            {
                InputStream = newStream,
                Key = fileKey,
                BucketName = _bucketName,
                ContentType = file.ContentType
            };

            var fileTransferUtility = new TransferUtility(s3Client);
            await fileTransferUtility.UploadAsync(uploadRequest);

            // Retornamos la URL pública para guardarla en la DB
            var baseUrl = config["SupabaseS3:ServicePublicUrl"];
            return $"{baseUrl}/{_bucketName}/{fileKey}";
        }
    }
}
