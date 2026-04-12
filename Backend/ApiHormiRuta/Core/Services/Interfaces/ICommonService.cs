using Core.Dto.Category;

namespace Core.Services.Interfaces
{
    public interface ICommonService
    {
         Task<IEnumerable<CategoryPresentationDto>> GetPresentationCategoryList();
    }
}
