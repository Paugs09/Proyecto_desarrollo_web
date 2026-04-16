namespace Core.Dto.Cart
{
    public class OrderDto
    {
        public decimal TotalAmount { get; set; }
        public IEnumerable<OrderItemDto> OrderItems { get; set; } = [];
    }
}
