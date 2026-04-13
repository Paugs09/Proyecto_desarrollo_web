using Core.Dto.Product;
using Core.Entities;
using Core.Infraestructure;
using Core.QueryFilter.Product;
using Core.Services.Interfaces;

namespace Core.Services.Imp
{
    public class ProductService(IUnitOfWork unitOfWork,
                                IGenericRepository<Product> genericProductRepository,
                                IGenericRepository<AttributeValue> genericAttributeValueRepository,
                                IGenericRepository<ProductImage> genericProductImageRepository,
                                IGenericRepository<VariantValue> genericVariantValueRepository,
                                IGenericRepository<ProductVariant> genericProductVariantRepository) : IProductService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly IGenericRepository<ProductVariant> _genericProductVariantRepository = genericProductVariantRepository;
        private readonly IGenericRepository<Product> _genericProductRepository = genericProductRepository;
        private readonly IGenericRepository<AttributeValue> _genericAttributeValueRepository = genericAttributeValueRepository;
        private readonly IGenericRepository<VariantValue> _genericVariantValueRepository = genericVariantValueRepository;
        private readonly IGenericRepository<ProductImage> _genericProductImageRepository = genericProductImageRepository;

        public async Task<IEnumerable<ProductDto>?> GetAllProductsAsync(ProductQueryFilter queryFilter)
        {
            var products = await _genericProductRepository.GetAllAsync(x=> x.ProductImages);

            if (queryFilter.CategoryId.HasValue)
                products = products.Where(x => x.CategoryId == queryFilter.CategoryId.Value);

            if(!string.IsNullOrWhiteSpace(queryFilter.PorductName))
                products = products.Where(x => x.Name.Contains(queryFilter.PorductName));

            return products.Select(x=> new ProductDto
            {
                Id = x.Id,
                Name = x.Name,
                ShortDescription = x.ShortDescription,
                BasePrice = x.BasePrice,
                ImageUrl = x.ProductImages.FirstOrDefault(x=> x.IsPrimary)?.ImageUrl,
            });
        }

        //public async Task CreateProduct(CreateProductDto createProductDto)
        //{
        //    var product = new Product
        //    {
        //        Name = createProductDto.Name,
        //        ShortDescription = createProductDto.ShortDescription,
        //        LongDescription = createProductDto.LongDescription,
        //        BasePrice = createProductDto.BasePrice,
        //        CategoryId = createProductDto.CategoryId,
        //        MaterialId = createProductDto.MaterialId,
        //        MunicipalityId = createProductDto.MunicipalityId,
        //        Notes = createProductDto.Notes,
        //        Dimensions = createProductDto.Dimensions
        //    };

        //    await _genericProductRepository.AddAsync(product);

        //    foreach (var productVariantItem in createProductDto.ProductVariants)
        //    {
        //        var productVariant = new ProductVariant
        //        {
        //            ProductId = product.Id,
        //            Sku = productVariantItem.Sku,
        //            EspecificPrice = productVariantItem.EspecificPrice,
        //            Stock = productVariantItem.Stock
        //        };

        //        foreach (var productImageItem in createProductDto.ProductImages)
        //        {
        //            var productImage = new ProductImage
        //            {
        //                ProductId = product.Id,
        //                VariantId = productVariant.Id,
        //                ImageUrl = productImageItem.ImageUrl,
        //                IsPrimary = productImageItem.IsPrimary,
        //                DisplayOrder = productImageItem.DisplayOrder
        //            };
        //        }

        //        //aqui haz el addAsync

        //        foreach (var attributeValueItem in productVariantItem.AttributeValues)
        //        {
        //            var attributeValue = new AttributeValue
        //            {
        //                AttributeId = attributeValueItem.AttributeId,
        //                Value = attributeValueItem.Value
        //            };

        //            //aqui haz el addAsync

        //            var variantValue = new VariantValue
        //            {
        //                ProductVariantId = productVariant.Id,
        //                AttributeValueId = attributeValue.Id
        //            };

        //            //aqui haz el addAsync
        //        }
        //    }
        //}

        public async Task CreateProduct(CreateProductDto createProductDto)
        {
            await _unitOfWork.BeginTransactionAsync();

            try
            {
                var product = new Product
                {
                    Name = createProductDto.Name,
                    ShortDescription = createProductDto.ShortDescription,
                    LongDescription = createProductDto.LongDescription,
                    BasePrice = createProductDto.BasePrice,
                    CategoryId = createProductDto.CategoryId,
                    MaterialId = createProductDto.MaterialId,
                    MunicipalityId = createProductDto.MunicipalityId,
                    Notes = createProductDto.Notes,
                    Dimensions = createProductDto.Dimensions
                };

                await _genericProductRepository.AddAsync(product);
                await _unitOfWork.SaveChangesAsync();

                foreach (var productVariantItem in createProductDto.ProductVariants)
                {
                    var productVariant = new ProductVariant
                    {
                        ProductId = product.Id,
                        Sku = productVariantItem.Sku,
                        EspecificPrice = productVariantItem.EspecificPrice,
                        Stock = productVariantItem.Stock
                    };

                    await _genericProductVariantRepository.AddAsync(productVariant);
                    await _unitOfWork.SaveChangesAsync();

                    // Imágenes
                    foreach (var productImageItem in createProductDto.ProductImages)
                    {
                        var productImage = new ProductImage
                        {
                            ProductId = product.Id,
                            VariantId = productVariant.Id,
                            ImageUrl = productImageItem.ImageUrl,
                            IsPrimary = productImageItem.IsPrimary,
                            DisplayOrder = productImageItem.DisplayOrder
                        };

                        await _genericProductImageRepository.AddAsync(productImage);
                    }

                    // Atributos
                    foreach (var attributeValueItem in productVariantItem.AttributeValues)
                    {
                        var attributeValue = new AttributeValue
                        {
                            AttributeId = attributeValueItem.AttributeId,
                            Value = attributeValueItem.Value
                        };

                        await _genericAttributeValueRepository.AddAsync(attributeValue);
                        await _unitOfWork.SaveChangesAsync();

                        var variantValue = new VariantValue
                        {
                            ProductVariantId = productVariant.Id,
                            AttributeValueId = attributeValue.Id
                        };

                        await _genericVariantValueRepository.AddAsync(variantValue);
                    }
                }

                await _unitOfWork.CommitAsync();
            }
            catch
            {
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }
    }
}
