namespace Core.Dto.Product.ProductVariant
{
    public class DetailValueDto
    {
        public long AttributeId { get; set; }
        public string AttributeName { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
    }
}
