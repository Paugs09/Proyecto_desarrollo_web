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
                .HasColumnName("id");

            builder.Property(r => r.Name)
                .IsRequired()
                .HasColumnName("name");

            builder.Property(r => r.Description)
                .IsRequired(false)
                .HasColumnName("description");
        }
    }
}
