namespace Core.Entities
{
    public class VariantValue
    {
        public long ProductVariantId { get; set; }
        public long AttributeValueId { get; set; }

        public ProductVariant ProductVariant { get; set; } = null!;
        public AttributeValue AttributeValue { get; set; } = null!;
    }
}
