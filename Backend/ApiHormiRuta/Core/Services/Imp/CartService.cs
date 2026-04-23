using Core.Dto.Cart.CartItem;
using Core.Dto.Cart.Order;
using Core.Dto.Product.ProductVariant;
using Core.Entities;
using Core.Exceptions;
using Core.Infraestructure;
using Core.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Core.Services.Imp
{
    public class CartService(IUnitOfWork unitOfWork,
                             ICommonRepository commonRepository,
                             IGenericRepository<Order> genericOrderRepository,
                             IGenericRepository<CartItem> genericCartItemRepository,
                             IGenericRepository<ProductVariant> genericProductVariantRepository) : ICartService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly ICommonRepository _commonRepository = commonRepository;
        private readonly IGenericRepository<Order> _genericOrderRepository = genericOrderRepository;
        private readonly IGenericRepository<CartItem> _genericCartItemRepository = genericCartItemRepository;
        private readonly IGenericRepository<ProductVariant> _genericProductVariantRepository = genericProductVariantRepository;

        public async Task<InfoOrderCreatedDto?> CreateOrder(List<CreateOrderItemDto> items, Guid userId)
        {
            try
            {
                return await _commonRepository.CallFunctionAddOrder(items, userId);
            }
            catch (Postgrest.Exceptions.PostgrestException ex)
            {
                throw new BusinessException(HttpStatusCode.BadRequest, "Error", $"Error en el carrito: {ex.Message}");
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
                        ?? throw new BusinessException(HttpStatusCode.NotFound, "No encontrada", "Orden no encontrada");

                    if (order.PaymentStatus == "Pagado") return;

                    foreach (var item in order.OrderItems)
                    {
                        var variant = await _genericProductVariantRepository.GetQueryable()
                            .FirstOrDefaultAsync(v => v.Id == item.ProductVariantId && v.IsActive);

                        if (variant == null || variant.Stock < item.Quantity)
                            throw new BusinessException(HttpStatusCode.BadRequest, "Stock insuficiente", $"Stock insuficiente para la variante ID: {item.ProductVariantId}");

                        variant.Stock -= item.Quantity;

                        var cartProduct = await _genericCartItemRepository.GetQueryable()
                        .FirstOrDefaultAsync(x => x.ProductVariantId == variant.Id && x.UserId == userId && x.ProductVariant.IsActive);

                        if (cartProduct != null) _genericCartItemRepository.Delete(cartProduct);
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

        public async Task ManageProductsOfCart(List<CreateCartItemDto> cartItemsDto, Guid userId)
        {
            var productVariantIds = cartItemsDto.Select(x => x.ProductVariantId).ToList();

            var existingItems = await _genericCartItemRepository
                .GetQueryable(q => q.Include(x => x.ProductVariant))
                .Where(x => x.UserId == userId && productVariantIds.Contains(x.ProductVariantId))
                .ToListAsync();

            // Convertimos a Diccionario para búsqueda O(1)
            var existingItemsDict = existingItems.ToDictionary(x => x.ProductVariantId);

            var toUpdate = new List<CartItem>();
            var toRemove = new List<CartItem>();
            var toAdd = new List<CartItem>();

            foreach (var dto in cartItemsDto)
            {
                existingItemsDict.TryGetValue(dto.ProductVariantId, out var existing);

                if (existing != null)
                {
                    // Si la cantidad es 0 o el producto ya no está activo, lo quitamos del carrito
                    if (dto.Quantify <= 0 || !existing.ProductVariant.IsActive)
                    {
                        toRemove.Add(existing);
                    }
                    else if (existing.Quantify != dto.Quantify) // Solo actualiza si hubo cambios
                    {
                        existing.Quantify = dto.Quantify;
                        toUpdate.Add(existing);
                    }
                }
                else if (dto.Quantify > 0)
                {
                    toAdd.Add(new CartItem
                    {
                        UserId = userId,
                        ProductVariantId = dto.ProductVariantId,
                        Quantify = dto.Quantify
                    });
                }
            }

            // 3. Ejecución por lotes
            if (toRemove.Count != 0) _genericCartItemRepository.DeleteRange(toRemove);
            if (toUpdate.Count != 0) _genericCartItemRepository.UpdateRange(toUpdate);
            if (toAdd.Count != 0) await _genericCartItemRepository.AddRangeAsync(toAdd);

            await _genericCartItemRepository.SaveAsync();
        }

        public IQueryable<OrderItemDto>? GetCartItemInfo(Guid userId)
        {
            var cart = _genericCartItemRepository.GetQueryable()
                .AsNoTracking()
                .Where(x => x.UserId == userId && x.ProductVariant.IsActive)
                .Select(x=> new OrderItemDto
                {
                    ProductVariantId = x.ProductVariantId,
                    ProductName = x.ProductVariant.Product.Name,
                    Category = x.ProductVariant.Product.Category.Name,
                    ImageUrl = x.ProductVariant.ProductImages.Where(x => x.IsPrimary).Select(x => x.ImageUrl).FirstOrDefault()!,
                    DetailValues = x.ProductVariant.VariantValues.Select(vv => new DetailValueDto
                    {
                        AttributeId = vv.AttributeValue.AttributeId,
                        AttributeName = vv.AttributeValue.Attribute.Name,
                        Value = vv.AttributeValue.Value
                    }).ToList(),
                    Quantify = x.Quantify,
                    UnitPrice = x.ProductVariant.SpecificPrice,
                    TotalAmountPerUnit = x.Quantify * x.ProductVariant.SpecificPrice
                });

            return cart;
        }
    }
}
