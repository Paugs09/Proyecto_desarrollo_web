using Core.Dto.Attribute.AttributeValue;

namespace Core.Dto.Product.ProductVariant
{
    public class CreateProductVariantDto
    {
        public long ProductId { get; set; }
        public string Sku { get; set; } = string.Empty;
        public decimal SpecificPrice { get; set; }
        public int Stock { get; set; }
        public List<CreateAttributeValueDto> AttributeValues { get; set; } = [];
    }
}
