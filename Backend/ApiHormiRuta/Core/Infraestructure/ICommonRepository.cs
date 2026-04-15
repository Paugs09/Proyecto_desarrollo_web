using Core.Dto.Cart;

namespace Core.Infraestructure
{
    public interface ICommonRepository
    {
        Task<List<long>> CallFunctionRegisterProducts(string jsonPayload);
        Task CallFunctionDeleteProduct(long productId);
        Task CallFunctionAddOrder(List<CreateOrderItemDto> items, Guid userId);
    }
}
