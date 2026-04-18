using Core.Entities;
using Core.Infraestructure;
using Core.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Core.Services.Imp
{
    public class RoleService(IGenericRepository<UserProfile> userGenericRepository) : IRoleService
    {
        private readonly IGenericRepository<UserProfile> _userGenericRepository = userGenericRepository;

        public async Task<bool> IsAdmin(Guid userId)
        {
            var user = await _userGenericRepository.GetQueryable()
                .AsNoTracking().Include(x=> x.Role)
                .FirstOrDefaultAsync(x => x.Id == userId) ?? throw new Exception("User not found");

            return user.Role.Name.Equals(constants.Role.Admin, StringComparison.OrdinalIgnoreCase);
        }
    }
}
