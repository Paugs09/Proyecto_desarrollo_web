using Microsoft.EntityFrameworkCore.Storage;

namespace Core.Infraestructure
{
    public interface IUnitOfWork : IDisposable
    {
        Task<IDbContextTransaction> BeginTransactionAsync();
        IExecutionStrategy CreateExecutionStrategy();
        Task SaveChangesAsync();
        Task CommitAsync();
        Task RollbackAsync();
    }
}
