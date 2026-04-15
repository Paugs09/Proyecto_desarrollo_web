using Core.Entities;
using Core.Infraestructure;
using Infraestructure.Data;
using Microsoft.EntityFrameworkCore;

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
    }
}
