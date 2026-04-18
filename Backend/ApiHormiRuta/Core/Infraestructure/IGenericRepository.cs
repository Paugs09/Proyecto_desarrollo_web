using System.Linq.Expressions;

namespace Core.Infraestructure
{
    public interface IGenericRepository<T> where T : class
    {
        IQueryable<T> GetQueryable(Func<IQueryable<T>, IQueryable<T>>? includeFunc = null);
        Task<T?> FirstOrDefaultAsyncWithIncludes(
            Expression<Func<T, bool>> predicate,
            Func<IQueryable<T>, IQueryable<T>>? includeFunc = null);
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate, Func<IQueryable<T>, IQueryable<T>>? includeFunc = null);
        Task AddAsync(T entity);
        Task AddRangeAsync(List<T> entities);
        void Update(T entity);
        Task DeleteByIdAsync(object id);
        Task<bool> SaveAsync();
    }
}
