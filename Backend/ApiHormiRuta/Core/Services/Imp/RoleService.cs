using Core.Entities;
using Core.Exceptions;
using Core.Infraestructure;
using Core.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Core.Services.Imp
{
    public class RoleService(IGenericRepository<UserProfile> userGenericRepository) : IRoleService
    {
        private readonly IGenericRepository<UserProfile> _userGenericRepository = userGenericRepository;

        public async Task<bool> IsAdmin(Guid userId)
        {
            var user = await _userGenericRepository.GetQueryable()
                .AsNoTracking().Include(x=> x.Role)
                .FirstOrDefaultAsync(x => x.Id == userId) ?? throw new BusinessException(HttpStatusCode.BadRequest, "Error", "Usuario no encontrado");

            return user.Role.Name.Equals(constants.Role.Admin, StringComparison.OrdinalIgnoreCase);
        }
    }
}
