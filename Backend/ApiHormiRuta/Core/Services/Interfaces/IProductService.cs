using Core.Dto.Product;
using Core.QueryFilter.Product;
using Microsoft.AspNetCore.Http;

namespace Core.Services.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>?> GetAllProductsAsync(ProductQueryFilter queryFilter);
        Task AddProductToWishList(CreateWishListDto createDto, Guid userId);
        Task<DetailProductDto> GetDetailProduct(long id);
        Task CreateProduct(CreateProductDto createProductDto);
        Task DeleteProduct(long productId);
        Task<string> CreateProductImage(IFormFile formFile);
    }
}
