using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Core.Entities;
using Core.Infraestructure;
using Core.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Core.Services.Imp
{
    public class StorageService(IAmazonS3 s3Client,
                                IConfiguration config,
                                IGenericRepository<ProductImage> genericProductImageRepository) : IStorageService
    {
        private readonly string _bucketName = config["SupabaseS3:BucketName"]!;
        private readonly IGenericRepository<ProductImage> _genericProductImageRepository = genericProductImageRepository;

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

        public async Task DeleteMultipleImagesByUrlsAsync(List<string>? imageUrls)
        {
            try
            {
                if (imageUrls == null || imageUrls.Count == 0) return;

                string bucketSegment = _bucketName + "/";
                var deleteRequest = new DeleteObjectsRequest
                {
                    BucketName = _bucketName,
                    Objects = imageUrls.Select(url =>
                    {
                        var uri = new Uri(url);

                        // Buscamos dónde termina el nombre del bucket en la ruta
                        int bucketIndex = uri.AbsolutePath.IndexOf(bucketSegment);

                        var key = uri.AbsolutePath.Substring(bucketIndex + bucketSegment.Length);
                        return new KeyVersion { Key = key };
                    }).ToList()
                };

                await s3Client.DeleteObjectsAsync(deleteRequest);
            }
            catch (AmazonS3Exception e)
            {
                throw new Exception("Error deleting images from S3", e);
            }
        }
    }
}
