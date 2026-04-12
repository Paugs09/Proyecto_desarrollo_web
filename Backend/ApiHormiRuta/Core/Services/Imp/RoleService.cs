using Core.Entities;
using Core.Services.Interfaces;
using static Postgrest.Constants;

namespace Core.Services.Imp
{
    public class RoleService(Supabase.Client supabase) : IRoleService
    {
        private readonly Supabase.Client _supabase = supabase;

        public async Task<bool> IsAdmin(Guid userId)
        {
            // En Supabase .NET, los joins se hacen mediante strings en .Select()
            // "roles!inner(name)" hace un INNER JOIN con la tabla roles y filtra por el nombre.
            var result = await _supabase.From<UserProfile>()
                .Select("id, roles!inner(name)")
                .Filter("id", Operator.Equals, userId)
                .Filter("roles.name", Operator.Equals, "admin")
                .Single();

            // Si result no es nulo, el usuario existe Y es administrador.
            return result != null;
        }
    }
}
