using Core.CustomEntities;
using Core.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Infraestructure.Filters
{
    public class AdminOnlyAttribute : TypeFilterAttribute
    {
        public AdminOnlyAttribute() : base(typeof(AdminOnlyFilter)) { }
    }

    public class AdminOnlyFilter(IRoleService roleService) : IAsyncAuthorizationFilter
    {
        private readonly IRoleService _roleService = roleService;

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            // El token ya fue validado por ValidateTokenFilter
            var userId = context.HttpContext.Items["UserId"]?.ToString();

            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out Guid parsedUserId))
            {
                var response = new Response
                {
                    Status = 401,
                    Message = "Unauthorized access.",
                    Description = "Your authentication token is missing or invalid. Please log in to access this resource."
                };

                context.Result = new ObjectResult(response);
                return;
            }

            try
            {
                var isAdmin = await _roleService.IsAdmin(parsedUserId);

                if (!isAdmin)
                {
                    var response = new Response
                    {
                        Status = 403,
                        Message = "Access denied. Admins only.",
                        Description = "You do not have the necessary permissions to access this resource."
                    };

                    context.Result = new ObjectResult(response);
                }
            }
            catch
            {
                var response = new Response
                {
                    Status = 401,
                    Message = "Unauthorized access.",
                    Description = "An error occurred while verifying your permissions. Please try again later."
                };

                context.Result = new ObjectResult(response);
            }
        }
    }
}
