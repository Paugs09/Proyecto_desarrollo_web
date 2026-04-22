using Core.Dto.Cart.Order;
using Core.Dto.Product;
using Core.Infraestructure;
using Infraestructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Infraestructure.Repositories
{
    public class CommonRepository(AppDbContext context) : ICommonRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<List<long>> CallFunctionRegisterProducts(string jsonPayload)
        {
            try
            {
                var result = await _context.Database
                    .SqlQueryRaw<long>("SELECT public.create_full_product({0}::jsonb)", jsonPayload)
                    .ToListAsync();

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al llamar a la función create_full_product", ex);
            }
        }

        public async Task CallFunctionUpdateProduct(long productId, UpdateProductDto updateProductDto)
        {
            try
            {
                var jsonPayload = JsonSerializer.Serialize(updateProductDto);

                var result = await _context.Database
                    .SqlQueryRaw<long>(
                        "SELECT public.update_product({0}, {1}::jsonb)",
                        productId,
                        jsonPayload
                    )
                    .ToListAsync();

                var jsonResult = result.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error en la base de datos: {ex.Message}", ex);
            }
        }

        public async Task CallFunctionDeleteProduct(long productId)
        {
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "SELECT public.delete_product_complete({0})",
                    productId
                );
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

        public async Task<InfoOrderCreatedDto?> CallFunctionAddOrder(List<CreateOrderItemDto> items, Guid userId)
        {
            try
            {
                var jsonPayload = JsonSerializer.Serialize(items);

                var result = await _context.Database
                    .SqlQueryRaw<string>(
                        "SELECT public.handle_cart_operations({0}::uuid, {1}::jsonb)::text",
                        userId,
                        jsonPayload
                    )
                    .ToListAsync();


                var jsonResult = result.First();
                return JsonSerializer.Deserialize<InfoOrderCreatedDto>(jsonResult);
            }
            catch (Exception ex)
            { 
                throw new Exception($"Error en la base de datos: {ex.Message}", ex);
            }
        }
    }
}
