using Core.Dto.Cart;
using Core.Entities;
using Core.Infraestructure;
using Core.Services.Interfaces;

namespace Core.Services.Imp
{
    public class CartService(IGenericRepository<Order> genericOrderRepository,
                             IGenericRepository<OrderItem> genericOrderItemRepository) : ICartService
    {
        private readonly IGenericRepository<Order> _genericOrderRepository = genericOrderRepository;
        private readonly IGenericRepository<OrderItem> _genericOrderItemRepository = genericOrderItemRepository;

        public async Task CreateOrder(CreateOrderDto createOrderDto, Guid userId)
        {
            var order = new Order
            {
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                PaymentStatus = "Pendiente",
                ShippingStatus = "Pendiente",
                TotalAmount = createOrderDto.TotalAmount,
                CreatedAt = DateTime.UtcNow
            };

            await _genericOrderRepository.AddAsync(order);
            await _genericOrderRepository.SaveAsync();

            var orderItems = new List<OrderItem>();
            foreach (var item in createOrderDto.OrderItems)
            {
                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    ProductVariantId = item.ProductVariantId,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    CreatedAt = DateTime.UtcNow
                };
                orderItems.Add(orderItem);
            }

            await _genericOrderItemRepository.AddRangeAsync(orderItems);
            await _genericOrderItemRepository.SaveAsync();
        }
    }
}
