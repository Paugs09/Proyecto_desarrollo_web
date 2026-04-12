namespace Core.Entities
{
    public class ProductImage
    {
        public long Id { get; set; }
        public long ProductId { get; set; }
        public long VariantId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsPrimary { get; set; }
        public int DisplayOrder { get; set; }
        public DateTime CreatedAt { get; set; }

        public virtual Product Product { get; set; } = null!;
        public virtual ProductVariant ProductVariant { get; set; } = null!;
    }
}
