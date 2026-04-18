using Core.Dto.Cart;
using Core.Entities;
using Core.Infraestructure;
using Core.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Core.Services.Imp
{
    public class CartService(ICommonRepository commonRepository,
                             IGenericRepository<Order> genericOrderRepository,
                             IGenericRepository<OrderItem> genericOrderItemRepository) : ICartService
    {
        private readonly ICommonRepository _commonRepository = commonRepository;
        private readonly IGenericRepository<Order> _genericOrderRepository = genericOrderRepository;
        private readonly IGenericRepository<OrderItem> _genericOrderItemRepository = genericOrderItemRepository;

        public async Task CreateOrder(List<CreateOrderItemDto> items, Guid userId)
        {
            try
            {
                await _commonRepository.CallFunctionAddOrder(items, userId);
            }
            catch (Postgrest.Exceptions.PostgrestException ex)
            {
                throw new Exception($"Error en el carrito: {ex.Message}");
            }
        }

        public async Task<OrderDto> GetOrderInfo(Guid userId)
        {
            var order = await _genericOrderRepository.FirstOrDefaultAsyncWithIncludes(x=> x.UserId == userId, 
                query => query.Include(o => o.OrderItems)
                                .ThenInclude(x=> x.ProductVariant.ProductImages)
                                    .ThenInclude(x=> x.Product)
                                        .ThenInclude(x=> x.Category)) ?? throw new Exception("Orden no encontrada");

            var orderDto = new OrderDto
            {
                TotalAmount = order.TotalAmount,
                OrderItems = order.OrderItems.Select(x => new OrderItemDto
                {
                    ProductVariantId = x.ProductVariantId,
                    ProductName = x.ProductVariant.Product.Name,
                    Category = x.ProductVariant.Product.Category.Name,
                    ImageUrl = x.ProductVariant.ProductImages.FirstOrDefault(pi => pi.IsPrimary)?.ImageUrl ?? string.Empty,
                    Quantify = x.Quantity,
                    UnitPrice = x.UnitPrice,
                    TotalAmountPerUnit = x.Quantity * x.UnitPrice
                })
            };

            return orderDto;
        } 
    }
}
