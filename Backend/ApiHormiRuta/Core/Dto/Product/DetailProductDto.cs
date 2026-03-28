using Core.Dto.Product.ProductImage;
using Core.Dto.Product.ProductVariant;

namespace Core.Dto.Product
{
    public class DetailProductDto
    {
        public long Id { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ShortDescription { get; set; } = string.Empty;
        public string? LongDescription { get; set; }
        public string Category { get; set; } = string.Empty;
        public string? Material { get; set; }
        public string Municipality { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public string Dimensions { get; set; } = string.Empty;
        public List<DetailProductImageDto> Images { get; set; } = [];
        public List<DetailProductVariantDto> Variants { get; set; } = [];
    }
}
