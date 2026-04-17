using Core.Dto.Cart;
using Core.Dto.Product;

namespace Core.Infraestructure
{
    public interface ICommonRepository
    {
        Task<List<long>> CallFunctionRegisterProducts(string jsonPayload);
        Task CallFunctionUpdateProduct(long productId, UpdateProductDto updateProductDto);
        Task CallFunctionDeleteProduct(long productId);
        Task CallFunctionAddOrder(List<CreateOrderItemDto> items, Guid userId);
    }
}
