using Core.Dto.Product;
using Core.QueryFilter.Product;

namespace Core.Services.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>?> GetAllProductsAsync(ProductQueryFilter queryFilter);
        Task CreateProduct(CreateProductDto createProductDto);
    }
}
