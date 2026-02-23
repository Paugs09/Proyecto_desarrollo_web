using Core.Entities;
using Core.Infraestructure;
using Core.Services.Interfaces;

namespace Core.Services.Imp
{
    public class CommonService(ICommonRepository commonRepository) : ICommonService
    {
        private readonly ICommonRepository _commonRepository = commonRepository;

        public IQueryable<Role> GetRoles() => _commonRepository.GetRoles();
    }
}
