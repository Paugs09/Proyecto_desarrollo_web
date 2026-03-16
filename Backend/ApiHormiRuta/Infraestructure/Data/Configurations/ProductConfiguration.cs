using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Data.Configurations
{
    internal class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.ToTable("products");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .IsRequired()
                .HasColumnName("id");

            builder.Property(x => x.Name)
                .IsRequired()
                .HasColumnName("name");

            builder.Property(x => x.ShortDescription)
                .IsRequired()
                .HasColumnName("short_description");

            builder.Property(x => x.LongDescription)
                .IsRequired()
                .HasColumnName("long_description");

            builder.Property(x => x.BasePrice)
                .IsRequired()
                .HasColumnName("base_price");

            builder.Property(x => x.CategoryId)
                .IsRequired()
                .HasColumnName("category_id");

            builder.Property(x => x.MaterialId)
                .IsRequired()
                .HasColumnName("material_id");

            builder.Property(x => x.MunicipalityId)
                .IsRequired()
                .HasColumnName("municipality_id");

            builder.Property(x => x.CreatedAt)
                .IsRequired()
                .HasColumnName("created_at");

            builder.HasOne(x=> x.Category)
                .WithMany(x=> x.Products)
                .HasForeignKey(x=>x.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.Material)
                .WithMany(x => x.Products)
                .HasForeignKey(x => x.MaterialId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.Municipality)
                .WithMany(x => x.Products)
                .HasForeignKey(x => x.MunicipalityId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
