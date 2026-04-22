using Core.Dto.Cart.CartItem;
using Core.Dto.Cart.Order;

namespace Core.Services.Interfaces
{
    public interface ICartService
    {
        Task ManageProductsOfCart(List<CreateCartItemDto> cartItemsDto, Guid userId);
        Task<InfoOrderCreatedDto?> CreateOrder(List<CreateOrderItemDto> items, Guid userId);
        Task FinishOrder(Guid userId, long orderId);
        IQueryable<OrderItemDto>? GetCartItemInfo(Guid userId);
    }
}
