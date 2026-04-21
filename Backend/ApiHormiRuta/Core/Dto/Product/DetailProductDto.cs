using Core.Dto.Product.ProductVariant;

namespace Core.Dto.Product
{
    public class DetailProductDto
    {
        public long Id { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ShortDescription { get; set; } = string.Empty;
        public string? LongDescription { get; set; }
        public bool? IsFavorite {  get; set; }
        public string Category { get; set; } = string.Empty;
        public long CategoryId { get; set; }
        public string? Material { get; set; }
        public long? MaterialId { get; set; }
        public string Municipality { get; set; } = string.Empty;
        public long MunicipalityId { get; set; }
        public string Notes { get; set; } = string.Empty;
        public string Dimensions { get; set; } = string.Empty;
        public List<DetailProductVariantDto> Variants { get; set; } = [];
    }
}
