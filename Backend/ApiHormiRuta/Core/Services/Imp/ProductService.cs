using Core.Dto.Product;
using Core.Dto.Product.ProductImage;
using Core.Dto.Product.ProductVariant;
using Core.Entities;
using Core.Exceptions;
using Core.Infraestructure;
using Core.QueryFilter.Product;
using Core.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Text.Json;

namespace Core.Services.Imp
{
    public class ProductService(IStorageService storageService,
                                ICommonRepository commonRepository,
                                IGenericRepository<Order> genericOrderRepository,
                                IGenericRepository<Product> genericProductRepository,
                                IGenericRepository<WishList> genericWishListRepository,
                                IGenericRepository<OrderItem> genericOrderItemRepository) : IProductService
    {
        private readonly ICommonRepository _commonRepository = commonRepository;
        private readonly IStorageService _storageService = storageService;
        public readonly IGenericRepository<Order> _genericOrderRepository = genericOrderRepository;
        private readonly IGenericRepository<WishList> _genericWishListRepository = genericWishListRepository;
        private readonly IGenericRepository<OrderItem> _genericOrderItemRepository = genericOrderItemRepository;
        private readonly IGenericRepository<Product> _genericProductRepository = genericProductRepository;

        public async Task<IQueryable<ProductDto>?> GetAllProductsAsync(ProductQueryFilter queryFilter)
        {
            var query = _genericProductRepository.GetQueryable()
                .AsNoTracking()
                .Where(x => x.Active);

            if (queryFilter.CategoryId.HasValue)
                query = query.Where(x => x.CategoryId == queryFilter.CategoryId);

            if (!string.IsNullOrWhiteSpace(queryFilter.ProductName))
                query = query.Where(x => x.Name.ToLower().Contains(queryFilter.ProductName.ToLower()));

            var products = query.Select(x => new ProductDto
            {
                Id = x.Id,
                Name = x.Name,
                ShortDescription = x.ShortDescription,
                BasePrice = x.ProductVariants != null ? x.ProductVariants.First().SpecificPrice : 0,
                ImageUrl = x.ProductVariants != null ? x.ProductVariants.First().ProductImages.First(i => i.IsPrimary).ImageUrl : null,
            });

            return products;
        }

        public async Task<IQueryable<ProductDto>?> GetAllProductsOfWishList(Guid userId)
        {
            var wishList = _genericWishListRepository.GetQueryable()
                .AsNoTracking()
                .Where(x => x.UserId == userId);

            return wishList.Select(x => new ProductDto
            {
                Id = x.Product.Id,
                Name = x.Product.Name,
                Category = x.Product.Category.Name,
                BasePrice = x.Product.ProductVariants.First().SpecificPrice,
                ShortDescription = x.Product.ShortDescription,
                ImageUrl = x.Product.ProductImages.First(i => i.IsPrimary).ImageUrl,
            });
        }

        public async Task AddProductToWishList(CreateWishListDto createDto, Guid userId)
        {
            var wishListItem = await _genericWishListRepository.FirstOrDefaultAsyncWithIncludes(x => x.UserId == userId && x.ProductId == createDto.ProductId);

            if (!createDto.IsFavorite && wishListItem != null)
            {
                await _genericWishListRepository.DeleteByIdAsync(wishListItem.Id);
                await _genericWishListRepository.SaveAsync();
                return;
            }
            else if (wishListItem == null)
            {
                await _genericWishListRepository.AddAsync(new WishList
                {
                    UserId = userId,
                    ProductId = createDto.ProductId,
                });
                await _genericWishListRepository.SaveAsync();
            }
            else
            {
                throw new Exception("El producto ya está en favoritos");
            }
        }

        public async Task<DetailProductDto> GetDetailProduct(long id, Guid? userId)
        {
            var detailProduct = await _genericProductRepository.GetQueryable()
                .AsNoTracking()
                .Where(x => x.Id == id && x.Active)
                .Select(product => new DetailProductDto
                {
                    Id = product.Id,
                    ProductName = product.Name,
                    ShortDescription = product.ShortDescription,
                    LongDescription = product.LongDescription,
                    IsFavorite = userId != null && _genericWishListRepository.GetQueryable().Any(x => x.ProductId == product.Id && x.UserId == userId),
                    Category = product.Category.Name,
                    CategoryId = product.CategoryId,
                    Material = product.Material.Name,
                    MaterialId = product.MaterialId,
                    Municipality = product.Municipality.Name,
                    MunicipalityId = product.MunicipalityId,
                    Notes = product.Notes,
                    Dimensions = product.Dimensions,
                    Variants = product.ProductVariants.Select(x => new DetailProductVariantDto
                    {
                        Id = x.Id,
                        Sku = x.Sku,
                        SpecificPrice = x.SpecificPrice,
                        Stock = x.Stock,
                        Images = x.ProductImages.Select(i => new DetailProductImageDto
                        {
                            Id = i.Id,
                            ProductVariantId = x.Id,
                            ImageUrl = i.ImageUrl,
                            IsPrimary = i.IsPrimary,
                            DisplayOrder = i.DisplayOrder
                        }).ToList(),
                        Values = x.VariantValues.Select(vv => new DetailValueDto
                        {
                            AttributeId = vv.AttributeValue.AttributeId,
                            AttributeName = vv.AttributeValue.Attribute.Name,
                            Value = vv.AttributeValue.Value
                        }).ToList()
                    }).ToList()
                })
                .FirstOrDefaultAsync() ?? throw new BusinessException(HttpStatusCode.NotFound, "Producto no encontrado", "El producto no se encuentra");

            return detailProduct;
        }

        public async Task<IQueryable<BestSellerDto>> BestSellers()
        {
            return _genericOrderItemRepository.GetQueryable()
                .AsNoTracking()
                .Where(x => x.Order.PaymentStatus == "Pagado")
                .GroupBy(x => x.ProductVariantId)
                .Select(x => new BestSellerDto
                {
                    ProductVariantId = x.Key,
                    ProductName = x.First().ProductVariant.Product.Name,
                    ImageUrl = x.First().ProductVariant.ProductImages.Where(x => x.IsPrimary).Select(x => x.ImageUrl).First(),
                    TotalSales = x.Sum(x => x.Quantity)
                })
                .OrderByDescending(x => x.TotalSales)
                .Take(3);
        }

        public async Task CreateProduct(CreateProductDto createProductDto)
        {
            try
            {
                var jsonPayload = JsonSerializer.Serialize(createProductDto);

                var result = await _commonRepository.CallFunctionRegisterProducts(jsonPayload);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al procesar la creación del producto en la base de datos", ex);
            }
        }

        public async Task UpdateProduct(long productId, UpdateProductDto updateProductDto)
        {
            try
            {
                await _storageService.DeleteMultipleImagesByUrlsAsync(updateProductDto.ImageUrlsToDelete);

                await _commonRepository.CallFunctionUpdateProduct(productId, updateProductDto);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al editar el producto", ex);
            }
        }

        public async Task DeleteProduct(long productId)
        {
            var product = await _genericProductRepository.FirstOrDefaultAsyncWithIncludes(x => x.Id == productId) ?? throw new Exception("No se encontro el producto");
            product.Active = false;

            _genericProductRepository.Update(product);
            await _genericProductRepository.SaveAsync();
        }

        public async Task<string> CreateProductImage(IFormFile formFile)
        {
            var imagePath = await _storageService.UploadImageAsync(formFile, "products");
            return imagePath;
        }
    }
}
