using Core.Dto.Cart;

namespace Core.Services.Interfaces
{
    public interface ICartService
    {
        Task CreateOrder(CreateOrderDto createOrderDto, Guid userId);
    }
}
