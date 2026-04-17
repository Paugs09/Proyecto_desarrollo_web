using Microsoft.AspNetCore.Http;

namespace Core.Services.Interfaces
{
    public interface IStorageService
    {
        Task<string> UploadImageAsync(IFormFile file, string folder);
        Task DeleteMultipleImagesByUrlsAsync(List<string>? imageUrls);
    }
}
