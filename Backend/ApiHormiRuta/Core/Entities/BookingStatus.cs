namespace Core.Entities
{
    public class BookingStatus
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public virtual ICollection<Booking> Bookings { get; set; } = [];
    }
}
