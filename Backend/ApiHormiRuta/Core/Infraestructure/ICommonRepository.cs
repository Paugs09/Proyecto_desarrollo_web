using Core.Entities;

namespace Core.Infraestructure
{
    public interface ICommonRepository
    {
        Task<List<long>> CallFunctionRegisterProducts(string jsonPayload);
    }
}
