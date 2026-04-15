using Core.Dto.Category;
using Core.Entities;

namespace Core.Services.Interfaces
{
    public interface ICommonService
    {
        Task<IEnumerable<GeneralInfo>> Common(string parameter);
         Task<IEnumerable<CategoryPresentationDto>> GetPresentationCategoryList();
    }
}
