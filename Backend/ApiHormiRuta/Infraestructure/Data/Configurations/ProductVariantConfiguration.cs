using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Data.Configurations
{
    internal class ProductVariantConfiguration : IEntityTypeConfiguration<ProductVariant>
    {
        public void Configure(EntityTypeBuilder<ProductVariant> builder)
        {
            builder.ToTable("product_variants");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .IsRequired()
                .HasColumnName("id");

            builder.Property(x => x.ProductId)
                .IsRequired()
                .HasColumnName("product_id");

            builder.Property(x => x.Sku)
                .IsRequired()
                .HasColumnName("sku");

            builder.Property(x => x.SpecificPrice)
                .IsRequired()
                .HasColumnName("specific_price");

            builder.Property(x => x.Stock)
                .IsRequired()
                .HasColumnName("stock");

            builder.Property(x => x.IsActive)
                .IsRequired()
                .HasColumnName("is_active");

            builder.Property(x => x.CreatedAt)
                .IsRequired()
                .HasColumnName("created_at");

            builder.HasOne(x => x.Product)
                .WithMany(x => x.ProductVariants)
                .HasForeignKey(x => x.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}