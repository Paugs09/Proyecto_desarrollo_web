using Core.Dto.Cart;

namespace Core.Services.Interfaces
{
    public interface ICartService
    {
        Task CreateOrder(List<CreateOrderItemDto> createOrderItemDto, Guid userId);
        Task FinishOrder(Guid userId, long orderId);
        Task<OrderDto> GetOrderInfo(Guid userId);
    }
}
