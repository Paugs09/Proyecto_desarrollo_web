using Core.Dto.Auth;
using Core.Exceptions;
using Core.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Supabase.Gotrue.Exceptions;

namespace API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        private readonly IAuthService _authService = authService;

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] UserRegister request)
        {
            try
            {
                var token = await _authService.RegisterAsync(request);
                return Ok(new { Token = token });
            }
            catch (GotrueException ex) { return BadRequest(ex.Message); }
        }

        [HttpPut("user-update")]
        public async Task<IActionResult> UserUpdate([FromBody] UserUpdateDto updateDto)
        {
            try
            {
                var userId = HttpContext.Items["UserId"]?.ToString();
                _ = Guid.TryParse(userId, out Guid parsedUserId);

                await _authService.UserUpdate(parsedUserId, updateDto);
                return new ObjectResult(new { StatusCode = StatusCodes.Status204NoContent});
            }
            catch (BusinessException ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var info = await _authService.LoginAsync(request.Email, request.Password);

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,   // Bloquea el acceso desde JavaScript (Protege vs XSS)
                    Secure = false,
                    SameSite = SameSiteMode.Lax,
                    Expires = DateTime.UtcNow.AddSeconds(info.ExpiresIn),
                    Path = "/"
                };

                // Guardas el AccessToken en la cookie
                Response.Cookies.Append("sb_access_token", info.AccessToken, cookieOptions);

                return Ok(info);
            }
            catch (GotrueException ex) { return Unauthorized(ex.Message); }
        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
        {
            try
            {
                var result = await _authService.RefreshTokenAsync(request.AccessToken, request.RefreshToken);
                return Ok(result);
            }
            catch (GotrueException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpGet("user-info")]
        public async Task<IActionResult> GetUserInfo()
        {
            var userId = HttpContext.Items["UserId"]?.ToString();
            _ = Guid.TryParse(userId, out Guid parsedUserId);

            return Ok(await _authService.GetUserInfo(parsedUserId));
        }

        [HttpPost("upload-avatar")]
        [AllowAnonymous]
        public async Task<IActionResult> UploadAvatar([FromForm] IFormFile formFile)
        {
            return Ok(await _authService.UploadImagesForAvatar(formFile));
        }

        public class RefreshRequest
        {
            public string AccessToken { get; set; } = string.Empty;
            public string RefreshToken { get; set; } = string.Empty;
        }
    }

    public record LoginRequest(string Email, string Password);
}
