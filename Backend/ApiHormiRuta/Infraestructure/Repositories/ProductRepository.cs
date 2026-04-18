using Core.Dto.Product;
using Core.Entities;
using Core.Infraestructure;
using Core.QueryFilter.Product;
using Infraestructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Repositories
{
    public class ProductRepository(AppDbContext context) : IProductRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<IEnumerable<ProductDto>> GetProductsAsync(ProductQueryFilter queryFilter)
        {
            var firstVariantPerProduct = await _context.ProductVariants.AsNoTracking()
                .GroupBy(pv => pv.ProductId)
                .Select(g => g.OrderBy(x => x.Id).First())
                .ToListAsync();

            var firstPrimaryImagePerVariant = await _context.ProductImages.AsNoTracking()
                .Where(pi => pi.IsPrimary)
                .GroupBy(pi => pi.VariantId)
                .Select(g => g.First())
                .ToListAsync(); 

            return (from product in _context.Products.AsNoTracking()
                    join category in _context.Categories.AsNoTracking()
                        on product.CategoryId equals category.Id
                    join material in _context.Materials.AsNoTracking()
                        on product.MaterialId equals material.Id into materialGroup
                    from material in materialGroup.DefaultIfEmpty()
                    join variant in firstVariantPerProduct.AsEnumerable() 
                        on product.Id equals variant.ProductId into variantGroup
                    from variant in variantGroup.DefaultIfEmpty()
                    join image in firstPrimaryImagePerVariant.AsEnumerable() 
                        on variant.Id equals image.VariantId into imageGroup
                    from image in imageGroup.DefaultIfEmpty()
                    where
                        (!queryFilter.CategoryId.HasValue || product.CategoryId == queryFilter.CategoryId.Value) &&
                        (string.IsNullOrWhiteSpace(queryFilter.ProductName) ||
                         product.Name.Contains(queryFilter.ProductName))
                    select new ProductDto
                    {
                        Id = product.Id,
                        Name = product.Name,
                        ShortDescription = product.ShortDescription,
                        Category = category.Name,
                        BasePrice = variant != null ? variant.SpecificPrice : 0,
                        ImageUrl = image != null ? image.ImageUrl : null
                    })
                .ToList();  
        }
    }
}
