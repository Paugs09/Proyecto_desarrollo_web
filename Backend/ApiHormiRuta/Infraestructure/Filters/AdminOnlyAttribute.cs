using Core.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Infraestructure.Filters
{
    public class AdminOnlyAttribute : TypeFilterAttribute
    {
        public AdminOnlyAttribute() : base(typeof(AdminOnlyFilter)) { }
    }

    public class AdminOnlyFilter : IAsyncAuthorizationFilter
    {
        private readonly IRoleService _roleService;
        private readonly Supabase.Client _supabase;

        public AdminOnlyFilter(IRoleService roleService, Supabase.Client supabase)
        {
            _roleService = roleService;
            _supabase = supabase;
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            // 1. Extraer el token de los Headers
            var token = context.HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (string.IsNullOrEmpty(token))
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            try
            {
                // 2. Obtener el usuario del token usando el SDK de Supabase
                var user = await _supabase.Auth.GetUser(token);

                if (user == null || !Guid.TryParse(user.Id, out Guid userId))
                {
                    context.Result = new UnauthorizedResult();
                    return;
                }

                // 3. Validar en la BD si es admin
                var isAdmin = await _roleService.IsAdmin(userId);

                if (!isAdmin)
                {
                    context.Result = new ForbidResult(); // 403 Forbidden si no es admin
                }
            }
            catch
            {
                context.Result = new UnauthorizedResult();
            }
        }
    }
}
