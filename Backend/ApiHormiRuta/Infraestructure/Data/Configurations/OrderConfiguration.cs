using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Data.Configurations
{
    internal class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.ToTable("orders");

            builder.HasKey(o => o.Id);

            builder.Property(o => o.Id)
                .IsRequired()
                .HasColumnName("id");

            builder.Property(o => o.UserId)
                .IsRequired()
                .HasColumnName("user_id");

            builder.Property(o => o.OrderDate)
                .IsRequired()
                .HasColumnName("order_date");

            builder.Property(o => o.PaymentStatus)
                .IsRequired()
                .HasColumnName("payment_status");

            builder.Property(o => o.ShippingStatus)
                .IsRequired()
                .HasColumnName("shipping_status");

            builder.Property(o => o.TotalAmount)
                .IsRequired()
                .HasColumnName("total_amount");

            builder.Property(o => o.CreatedAt)
                .IsRequired()
                .HasColumnName("created_at");

            builder.HasOne(x => x.UserProfile)
                .WithMany(x => x.Orders)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
