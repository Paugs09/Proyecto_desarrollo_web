namespace Core.Entities
{
    public class WishList
    {
        public long Id { get; set; }
        public long ProductId { get; set; }
        public Guid UserId { get; set; }
        public DateTime CreatedAt { get; set; }

        public Product Product { get; set; } = null!;
        public UserProfile User { get; set; } = null!;
    }
}
