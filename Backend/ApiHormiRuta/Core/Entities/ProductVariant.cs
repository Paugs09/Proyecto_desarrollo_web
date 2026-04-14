namespace Core.Entities
{
    public class ProductVariant
    {
        public long Id { get; set; }
        public long ProductId { get; set; }
        public string Sku { get; set; } = string.Empty;
        public decimal SpecificPrice { get; set; }
        public int Stock { get; set; }
        public DateTime CreatedAt { get; set; }

        public virtual Product Product { get; set; } = null!;
        public virtual ICollection<VariantValue> VariantValues { get; set; } = [];
        public virtual ICollection<ProductImage> ProductImages { get; set; } = [];
        public virtual ICollection<WishList> WishLists { get; set; } = [];
    }
}
