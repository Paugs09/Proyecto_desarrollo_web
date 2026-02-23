using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Data.Configurations
{
    internal class RoleConfiguration : IEntityTypeConfiguration<Role>
    {
        public void Configure(EntityTypeBuilder<Role> builder)
        {
            builder.ToTable("roles");

            builder.HasKey(r => r.Id);

            builder.Property(r => r.Id)
                .IsRequired()
                .HasColumnType("int")
                .HasColumnName("id");

            builder.Property(r => r.Name)
                .IsRequired()
                .HasColumnType("varchar")
                .HasColumnName("name");
        }
    }
}
