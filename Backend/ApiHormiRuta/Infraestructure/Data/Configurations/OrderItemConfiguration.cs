using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Data.Configurations
{
    internal class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            builder.ToTable("order_items");

            builder.HasKey(oi => oi.Id);

            builder.Property(oi => oi.Id)
                .IsRequired()
                .HasColumnName("id");

            builder.Property(oi => oi.OrderId)
                .IsRequired()
                .HasColumnName("order_id");

            builder.Property(oi => oi.ProductVariantId)
                .IsRequired()
                .HasColumnName("variant_id");

            builder.Property(oi => oi.Quantity)
                .IsRequired()
                .HasColumnName("quantity");

            builder.Property(oi => oi.UnitPrice)
                .IsRequired()
                .HasColumnName("unit_price");

            builder.Property(oi => oi.VariantSnapshot)
                .IsRequired()
                .HasColumnName("variant_snapshot");

            builder.Property(oi => oi.ProductSnapshot)
                .IsRequired()
                .HasColumnName("product_snapshot");

            builder.Property(oi => oi.CreatedAt)
                .IsRequired()
                .HasColumnName("created_at");

            builder.HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(oi => oi.ProductVariant)
                .WithMany(pv => pv.OrderItems)
                .HasForeignKey(oi => oi.ProductVariantId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
