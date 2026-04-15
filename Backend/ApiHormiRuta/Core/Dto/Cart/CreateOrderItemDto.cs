namespace Core.Dto.Cart
{
    public class CreateOrderItemDto
    {
        public long ProductVariantId { get; set; }
        public int Quantity { get; set; }
    }
}
