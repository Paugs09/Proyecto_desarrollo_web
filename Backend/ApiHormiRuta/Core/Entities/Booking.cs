namespace Core.Entities
{
    public class Booking
    {
        public Guid Id { get; set; }
        public Guid ProfileId { get; set; }
        public int StatusId { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual Profile Profile { get; set; } = null!;
        public virtual BookingStatus Status { get; set; } = null!;
        public virtual ICollection<BookingDetailAdventure> BookingDetailAdventures { get; set; } = [];
        public virtual ICollection<BookingDetailHotel> BookingDetailHotels { get; set; } = [];
    }
}
