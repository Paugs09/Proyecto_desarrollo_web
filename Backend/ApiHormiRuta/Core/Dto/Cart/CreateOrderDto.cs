namespace Core.Dto.Cart
{
    public class CreateOrderDto
    {
        public decimal TotalAmount { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
        public string ShippingStatus { get; set; } = string.Empty;
        public List<CreateOrderItemDto> OrderItems { get; set; } = [];
    }
}
