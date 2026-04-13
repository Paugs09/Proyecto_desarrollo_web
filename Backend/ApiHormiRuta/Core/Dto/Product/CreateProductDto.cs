using Core.Dto.Product.ProductImage;
using Core.Dto.Product.ProductVariant;

namespace Core.Dto.Product
{
    public class CreateProductDto
    {
        public string Name { get; set; } = string.Empty;
        public string ShortDescription { get; set; } = string.Empty;
        public string? LongDescription { get; set; }
        public long CategoryId { get; set; }
        public long? MaterialId { get; set; }
        public long MunicipalityId { get; set; }
        public string Notes { get; set; } = string.Empty;
        public string Dimensions { get; set; } = string.Empty;
        public List<CreateProductVariantDto> ProductVariants { get; set; } = [];
    }
}
