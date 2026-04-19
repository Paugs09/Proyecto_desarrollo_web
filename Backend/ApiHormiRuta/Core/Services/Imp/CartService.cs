using Core.Dto.Cart;
using Core.Dto.Product.ProductVariant;
using Core.Entities;
using Core.Infraestructure;
using Core.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Core.Services.Imp
{
    public class CartService(ICommonRepository commonRepository,
                             IUnitOfWork unitOfWork,
                             IGenericRepository<ProductVariant> genericProductVariantRepository,
                             IGenericRepository<Order> genericOrderRepository,
                             IGenericRepository<OrderItem> genericOrderItemRepository) : ICartService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly ICommonRepository _commonRepository = commonRepository;
        private readonly IGenericRepository<Order> _genericOrderRepository = genericOrderRepository;
        private readonly IGenericRepository<OrderItem> _genericOrderItemRepository = genericOrderItemRepository;
        private readonly IGenericRepository<ProductVariant> _genericProductVariantRepository = genericProductVariantRepository;

        public async Task CreateOrder(List<CreateOrderItemDto> items, Guid userId)
        {
            try
            {
                await _commonRepository.CallFunctionAddOrder(items, userId);
            }
            catch (Postgrest.Exceptions.PostgrestException ex)
            {
                throw new Exception($"Error en el carrito: {ex.Message}");
            }
        }

        public async Task FinishOrder(Guid userId, long orderId)
        {
            var strategy = _unitOfWork.CreateExecutionStrategy();

            await strategy.ExecuteAsync(async () =>
            {
                // La transacción debe iniciarse en el bloque de ejecución
                using var transaction = await _unitOfWork.BeginTransactionAsync();

                try
                {
                    var order = await _genericOrderRepository.GetQueryable()
                        .Include(x => x.OrderItems)
                        .FirstOrDefaultAsync(x => x.Id == orderId && x.UserId == userId)
                        ?? throw new Exception("Orden no encontrada");

                    if (order.PaymentStatus == "Pagado") return;

                    foreach (var item in order.OrderItems)
                    {
                        var variant = await _genericProductVariantRepository.GetQueryable()
                            .FirstOrDefaultAsync(v => v.Id == item.ProductVariantId);

                        if (variant == null || variant.Stock < item.Quantity)
                            throw new Exception($"Stock insuficiente para la variante ID: {item.ProductVariantId}");

                        variant.Stock -= item.Quantity;
                    }

                    order.PaymentStatus = "Pagado";

                    await _unitOfWork.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            });
        }

        public async Task<OrderDto> GetOrderInfo(Guid userId)
        {
            var order = await _genericOrderRepository.GetQueryable()
                .AsNoTracking()
                .Where(x=> x.UserId == userId && x.PaymentStatus != "Pagado")
                .Select(order => new OrderDto
                {
                    OrderId = order.Id,
                    TotalAmount = order.TotalAmount,
                    OrderItems = order.OrderItems.Select(x => new OrderItemDto
                    {
                        ProductVariantId = x.ProductVariantId,
                        ProductName = x.ProductVariant.Product.Name,
                        Category = x.ProductVariant.Product.Category.Name,
                        ImageUrl = x.ProductVariant.ProductImages.Where(x=> x.IsPrimary).Select(x=> x.ImageUrl).FirstOrDefault()!,
                        DetailValues = x.ProductVariant.VariantValues.Select(vv => new DetailValueDto
                        {
                            AttributeId = vv.AttributeValue.AttributeId,
                            AttributeName = vv.AttributeValue.Attribute.Name,
                            Value = vv.AttributeValue.Value
                        }).ToList(),
                        Quantify = x.Quantity,
                        UnitPrice = x.UnitPrice,
                        TotalAmountPerUnit = x.Quantity * x.UnitPrice
                    }).ToList()
                })
                .FirstOrDefaultAsync() ?? throw new Exception("Orden no encontrada");

            return order;
        }
    }
}
