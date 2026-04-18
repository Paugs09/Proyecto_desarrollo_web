using Core.Dto.Product;
using Core.Infraestructure;
using Core.QueryFilter.Product;
using Infraestructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Repositories
{
    public class ProductRepository(AppDbContext context) : IProductRepository
    {
        private readonly AppDbContext _context = context;

        // COPIA ESTO:
        public async Task<IEnumerable<ProductDto>> GetProductsAsync(ProductQueryFilter queryFilter)
        {
            // Diccionarios para O(1) lookup
            var variantDict = await _context.ProductVariants.AsNoTracking()
                .GroupBy(pv => pv.ProductId)
                .Select(g => new { g.Key, Variant = g.OrderBy(x => x.Id).First() })
                .ToDictionaryAsync(x => x.Key, x => x.Variant);

            var imageDict = await _context.ProductImages.AsNoTracking()
                .Where(pi => pi.IsPrimary)
                .GroupBy(pi => pi.VariantId)
                .ToDictionaryAsync(g => g.Key, g => g.First());

            // Productos con filtros EN BD
            var products = await _context.Products.AsNoTracking()
                .Where(p =>
                    (!queryFilter.CategoryId.HasValue || p.CategoryId == queryFilter.CategoryId.Value) &&
                    (string.IsNullOrWhiteSpace(queryFilter.ProductName) ||
                     p.Name.Contains(queryFilter.ProductName)))
                .Include(p => p.Category)
                .ToListAsync();

            // Mapeo con lookups O(1)
            return products.Select(p =>
            {
                variantDict.TryGetValue(p.Id, out var variant);
                imageDict.TryGetValue(variant?.Id ?? 0, out var image);

                return new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    ShortDescription = p.ShortDescription,
                    Category = p.Category?.Name,
                    BasePrice = variant?.SpecificPrice ?? 0,
                    ImageUrl = image?.ImageUrl
                };
            }).ToList();
        }
    }
}
