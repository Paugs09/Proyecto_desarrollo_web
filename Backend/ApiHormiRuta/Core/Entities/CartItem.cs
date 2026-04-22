namespace Core.Entities
{
    public class CartItem
    {
        public long Id { get; set; }
        public Guid UserId { get; set; }
        public long ProductVariantId { get; set; }
        public int Quantify { get; set; }

        public virtual UserProfile UserProfile { get; set; } = null!;
        public virtual ProductVariant ProductVariant { get; set; } = null!;
    }
}
