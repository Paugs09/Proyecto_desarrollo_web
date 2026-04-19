namespace Core.Dto.Cart
{
    public class OrderDto
    {
        public long OrderId { get; set; }
        public decimal TotalAmount { get; set; }
        public IEnumerable<OrderItemDto> OrderItems { get; set; } = [];
    }
}
