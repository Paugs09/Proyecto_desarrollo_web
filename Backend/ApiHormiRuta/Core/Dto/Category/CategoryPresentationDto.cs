using Core.Entities;

namespace Core.Dto.Category
{
    public class CategoryPresentationDto : GeneralInfo
    {
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
    }
}
