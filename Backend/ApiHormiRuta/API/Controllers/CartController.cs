using Core.Dto.Cart;
using Core.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/cart")]
    [ApiController]
    public class CartController(ICartService cartService) : ControllerBase
    {
        private readonly ICartService _cartService = cartService;

        [HttpPost("create-order")]
        public async Task<IActionResult> CreateOrder(List<CreateOrderItemDto> createOrderItemDto)
        {
            var userId = HttpContext.Items["UserId"]?.ToString();
            _ = Guid.TryParse(userId, out Guid parsedUserId);

            await _cartService.CreateOrder(createOrderItemDto, parsedUserId);
            return Ok();
        }

        [HttpGet("order-info")]
        public async Task<IActionResult> ListOrderItems()
        {
            var userId = HttpContext.Items["UserId"]?.ToString();
            _ = Guid.TryParse(userId, out Guid parsedUserId);

            var orderDto = await _cartService.GetOrderInfo(parsedUserId);
            return Ok(orderDto);
        }
    }
}
