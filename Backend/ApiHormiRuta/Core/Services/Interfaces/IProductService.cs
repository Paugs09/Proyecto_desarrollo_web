using Core.Dto.Product;
using Core.QueryFilter.Product;
using Microsoft.AspNetCore.Http;

namespace Core.Services.Interfaces
{
    public interface IProductService
    {
        Task<IQueryable<ProductDto>?> GetAllProductsAsync(ProductQueryFilter queryFilter);
        Task<IQueryable<ProductDto>?> GetAllProductsOfWishList(Guid userId);
        Task AddProductToWishList(CreateWishListDto createDto, Guid userId);
        Task<DetailProductDto> GetDetailProduct(long id, Guid? userId);
        Task<IQueryable<BestSellerDto>> BestSellers();
        object PurchaseHistory(Guid userId);
        Task CreateProduct(CreateProductDto createProductDto);
        Task UpdateProduct(long productId, UpdateProductDto updateProductDto);
        Task DeleteProduct(long productId);
        Task<string> CreateProductImage(IFormFile formFile);
    }
}
