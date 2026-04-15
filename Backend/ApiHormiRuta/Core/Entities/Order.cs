namespace Core.Entities
{
    public class Order
    {
        public long Id { get; set; }
        public Guid UserId { get; set; }
        public DateTime OrderDate { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
        public string ShippingStatus { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }

        public virtual UserProfile UserProfile { get; set; } = null!;
        public virtual ICollection<OrderItem> OrderItems { get; set; } = [];
    }
}
