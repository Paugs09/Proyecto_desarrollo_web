using Core.Dto.Cart;

namespace Core.Services.Interfaces
{
    public interface ICartService
    {
        Task CreateOrder(List<CreateOrderItemDto> createOrderItemDto, Guid userId);
        Task<OrderDto> GetOrderInfo(Guid userId);
    }
}
