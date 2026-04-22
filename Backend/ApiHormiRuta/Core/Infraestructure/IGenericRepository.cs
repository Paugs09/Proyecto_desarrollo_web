using System.Linq.Expressions;

namespace Core.Infraestructure
{
    public interface IGenericRepository<T> where T : class
    {
        IQueryable<T> GetQueryable(Func<IQueryable<T>, IQueryable<T>>? includeFunc = null);
        Task<T?> FirstOrDefaultAsyncWithIncludes(Expression<Func<T, bool>> predicate, Func<IQueryable<T>, IQueryable<T>>? includeFunc = null);
        Task AddAsync(T entity);
        Task AddRangeAsync(List<T> entities);
        void Update(T entity);
        void UpdateRange(List<T> entity);
        Task DeleteByIdAsync(object id);
        void Delete(T entity);
        void DeleteRange(List<T> entities);
        Task<bool> SaveAsync();
    }
}
