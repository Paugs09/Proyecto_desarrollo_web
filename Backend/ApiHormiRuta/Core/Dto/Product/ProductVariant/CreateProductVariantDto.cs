using Core.Dto.Attribute.AttributeValue;
using Core.Dto.Product.ProductImage;

namespace Core.Dto.Product.ProductVariant
{
    public class CreateProductVariantDto
    {
        public string Sku { get; set; } = string.Empty;
        public decimal SpecificPrice { get; set; }
        public int Stock { get; set; }
        public List<CreateProductImageDto> ProductImages { get; set; } = [];
        public List<CreateAttributeValueDto> AttributeValues { get; set; } = [];
    }
}
