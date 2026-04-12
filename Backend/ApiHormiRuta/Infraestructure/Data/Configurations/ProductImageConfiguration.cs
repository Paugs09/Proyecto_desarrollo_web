using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Data.Configurations
{
    internal class ProductImageConfiguration : IEntityTypeConfiguration<ProductImage>
    {
        public void Configure(EntityTypeBuilder<ProductImage> builder)
        {
            builder.ToTable("product_images");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .IsRequired()
                .HasColumnName("id");

            builder.Property(x => x.ProductId)
                .IsRequired()
                .HasColumnName("product_id");

            builder.Property(x => x.VariantId)
                .IsRequired()
                .HasColumnName("variant_id");

            builder.Property(x => x.ImageUrl)
                .IsRequired()
                .HasColumnName("image_url");

            builder.Property(x => x.IsPrimary)
                .IsRequired()
                .HasColumnName("is_primary");

            builder.Property(x => x.DisplayOrder)
                .IsRequired()
                .HasColumnName("display_order");

            builder.Property(x => x.CreatedAt)
                .IsRequired()
                .HasColumnName("created_at");

            builder.HasOne(x => x.Product)
                .WithMany(x => x.ProductImages)
                .HasForeignKey(x => x.ProductId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(x => x.ProductVariant)
                .WithMany(x => x.ProductImages)
                .HasForeignKey(x => x.VariantId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
