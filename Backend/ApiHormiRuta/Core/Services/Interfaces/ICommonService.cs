using Core.Dto.Category;
using Core.Entities;

namespace Core.Services.Interfaces
{
    public interface ICommonService
    {
        Task<IQueryable<GeneralInfo>?> Common(string parameter);
         Task<IQueryable<CategoryPresentationDto>> GetPresentationCategoryList();
    }
}
