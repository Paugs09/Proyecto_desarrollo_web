using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using Supabase.Gotrue.Exceptions;
using System.Reflection;

namespace Infraestructure.Filters
{
    public class ValidateTokenAttribute : TypeFilterAttribute
    {
        public ValidateTokenAttribute() : base(typeof(ValidateTokenFilter)) { }
    }

    public class ValidateTokenFilter(Supabase.Client supabase, ILogger<ValidateTokenFilter> logger) : IAsyncAuthorizationFilter
    {
        private readonly Supabase.Client _supabase = supabase;
        private readonly ILogger<ValidateTokenFilter> _logger = logger;

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            // Verificar [AllowAnonymous] en el método y controlador
            if (context.ActionDescriptor is ControllerActionDescriptor descriptor)
            {
                var allowAnonymous = descriptor.MethodInfo.GetCustomAttribute<AllowAnonymousAttribute>() != null ||
                                    descriptor.ControllerTypeInfo.GetCustomAttribute<AllowAnonymousAttribute>() != null;

                if (allowAnonymous)
                    return;
            }

            var token = ExtractToken(context.HttpContext.Request);

            if (string.IsNullOrEmpty(token))
            {
                context.Result = new ObjectResult(new { error = "Token no proporcionado." }) { StatusCode = 401 };
                return;
            }

            try
            {
                var user = await _supabase.Auth.GetUser(token);

                if (user == null)
                {
                    context.Result = new ObjectResult(new { error = "Token inválido o expirado." }) { StatusCode = 401 };
                    return;
                }

                context.HttpContext.Items["UserId"] = user.Id;
                context.HttpContext.Items["User"] = user;
            }
            catch (GotrueException ex)
            {
                _logger.LogError($"Error validando token: {ex.Message}");
                context.Result = new ObjectResult(new { error = "Token inválido o expirado." }) { StatusCode = 401 };
            }
        }

        private static string? ExtractToken(HttpRequest request)
        {
            var authHeader = request.Headers["Authorization"].ToString();
            return string.IsNullOrEmpty(authHeader)
                ? null
                : authHeader.StartsWith("Bearer ")
                    ? authHeader.Substring("Bearer ".Length)
                    : null;
        }
    }

}
