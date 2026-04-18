using Core.Dto.Product;
using Core.Entities;
using Core.QueryFilter.Product;

namespace Core.Infraestructure
{
    public interface IProductRepository
    {
        Task<IEnumerable<ProductDto>> GetProductsAsync(ProductQueryFilter queryFilter);
    }
}
