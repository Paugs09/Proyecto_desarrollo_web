namespace Core.Entities
{
    public class AttributeValue
    {
        public long Id { get; set; }
        public long AttributeId { get; set; }
        public string Value { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public virtual Attribute Attribute { get; set; } = null!;
        public virtual ICollection<VariantValue> VariantValues { get; set; } = [];
    }
}
