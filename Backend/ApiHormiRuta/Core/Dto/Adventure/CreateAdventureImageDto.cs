using Microsoft.AspNetCore.Http;

namespace Core.Dto.Adventure
{
    public class CreateAdventureImageDto
    {
        public int DisplayOrder { get; set; }
        public bool IsPrimary { get; set; }
        public IFormFile FormFile { get; set; } = null!;
    }
}
