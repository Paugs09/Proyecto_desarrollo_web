using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Data.Configurations
{
    internal class MunicipalityConfiguration : IEntityTypeConfiguration<Municipality>
    {
        public void Configure(EntityTypeBuilder<Municipality> builder)
        {
            builder.ToTable("municipalities");

            builder.HasKey(c => c.Id);

            builder.Property(c => c.Id)
                .IsRequired()
                .HasColumnName("id");

            builder.Property(c => c.Name)
                .HasColumnName("name")
                .IsRequired();

            builder.Property(c => c.CreatedAt)
                .HasColumnName("created_at")
                .IsRequired();
        }
    }
}
