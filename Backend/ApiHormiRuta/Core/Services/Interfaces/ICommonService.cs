using Core.Entities;

namespace Core.Services.Interfaces
{
    public interface ICommonService
    {
        IQueryable<Role> GetRoles();
    }
}
