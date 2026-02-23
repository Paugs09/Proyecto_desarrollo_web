using Core.Entities;

namespace Core.Infraestructure
{
    public interface ICommonRepository
    {
        IQueryable<Role> GetRoles();
    }
}
