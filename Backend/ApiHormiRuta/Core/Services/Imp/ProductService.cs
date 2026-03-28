using Core.Dto.Product;
using Core.Dto.Product.ProductImage;
using Core.Dto.Product.ProductVariant;
using Core.Entities;
using Core.Infraestructure;
using Core.QueryFilter.Product;
using Core.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Core.Services.Imp
{
    public class ProductService(ICommonRepository commonRepository,
                                IGenericRepository<Product> genericProductRepository) : IProductService
    {
        private readonly ICommonRepository _commonRepository = commonRepository;
        private readonly IGenericRepository<Product> _genericProductRepository = genericProductRepository;

        public async Task<IEnumerable<ProductDto>?> GetAllProductsAsync(ProductQueryFilter queryFilter)
        {
            var products = await _genericProductRepository.GetAllAsync(x => x.ProductImages);

            if (queryFilter.CategoryId.HasValue)
                products = products.Where(x => x.CategoryId == queryFilter.CategoryId.Value);

            if (!string.IsNullOrWhiteSpace(queryFilter.PorductName))
                products = products.Where(x => x.Name.Contains(queryFilter.PorductName));

            return products.Select(x => new ProductDto
            {
                Id = x.Id,
                Name = x.Name,
                ShortDescription = x.ShortDescription,
                //BasePrice = x.BasePrice,
                ImageUrl = x.ProductImages.FirstOrDefault(x => x.IsPrimary)?.ImageUrl,
            });
        }

        public async Task<DetailProductDto> GetDetailProduct(long id)
        {
            var product = await _genericProductRepository.FirstOrDefaultAsyncWithIncludes(
                x => x.Id == id,
                query => query
                    .Include(p => p.Category)
                    .Include(p => p.Material)
                    .Include(p => p.Municipality)
                    .Include(p => p.ProductImages)
                    .Include(p => p.ProductVariants)
                        .ThenInclude(pv => pv.VariantValues)
                            .ThenInclude(vv => vv.AttributeValue)
                                .ThenInclude(vv=> vv.Attribute)
            ) ?? throw new Exception("Producto no encontrado");

            var p = new DetailProductDto
            {
                Id = product.Id,
                ProductName = product.Name,
                ShortDescription = product.ShortDescription,
                LongDescription = product.LongDescription,
                Category = product.Category.Name,
                Material = product.Material != null ? product.Material.Name : null,
                Municipality = product.Municipality.Name,
                Notes = product.Notes,
                Dimensions = product.Dimensions,
                Images = [.. product.ProductImages.Select(x => new DetailProductImageDto
                {
                    Id = x.Id,
                    ImageUrl = x.ImageUrl,
                    IsPrimary = x.IsPrimary
                })],
                Variants = [.. product.ProductVariants.Select(x => new DetailProductVariantDto
                {
                    Id = x.Id,
                    Sku = x.Sku,
                    SpecificPrice = x.SpecificPrice,
                    Stock = x.Stock,
                    Values = [.. x.VariantValues.Select(vv => new DetailValueDto
                    {
                        AttributeName = vv.AttributeValue.Attribute.Name,
                        Value = vv.AttributeValue.Value
                    })]
                })]
            };

            return p;
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
    }
}
