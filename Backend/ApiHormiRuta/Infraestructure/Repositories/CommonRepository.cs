using Core.Dto.Cart;
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

        public async Task CallFunctionDeleteProduct(long productId)
        {
            try
            {
                // Al ser una función que no retorna datos (void), usamos ExecuteSqlRawAsync
                await _context.Database.ExecuteSqlRawAsync(
                    "SELECT public.delete_product_complete({0})",
                    productId
                );
            }
            catch (Exception ex)
            {
                // Por ejemplo: "No se puede eliminar: El producto tiene historial en órdenes..."
                throw new Exception(ex.Message, ex);
            }
        }

        public async Task CallFunctionAddOrder(List<CreateOrderItemDto> items, Guid userId)
        {
            try
            {
                // Importante: Que las propiedades coincidan con el jsonb_to_recordset de la función
                var jsonPayload = JsonSerializer.Serialize(items);

                // Usamos FromSqlRaw para funciones que devuelven valores.
                // Como devuelve un JSONB, lo capturamos como string.
                var result = await _context.Database
                    .SqlQueryRaw<string>(
                        "SELECT public.handle_cart_operations({0}::uuid, {1}::jsonb)::text",
                        userId,
                        jsonPayload
                    )
                    .ToListAsync();

                var jsonResult = result.FirstOrDefault();
                // Aquí jsonResult contiene: {"order_id": 123, "total_amount": 45000}
            }
            catch (Exception ex)
            { 
                // caerá aquí con el mensaje personalizado de Postgres.
                throw new Exception($"Error en la base de datos: {ex.Message}", ex);
            }
        }
    }
}
