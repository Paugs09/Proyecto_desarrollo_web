using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Data.Configurations
{
    internal class BookingConfiguration : IEntityTypeConfiguration<Booking>
    {   
        public void Configure(EntityTypeBuilder<Booking> builder)
        {
            builder.ToTable("bookings");

            builder.HasKey(b => b.Id);

            builder.Property(b => b.Id)
                .IsRequired()
                .HasColumnName("id");

            builder.Property(b => b.ProfileId)
                .IsRequired()
                .HasColumnName("profile_id");

            builder.Property(b => b.StatusId)
                .IsRequired()
                .HasColumnName("status_id");

            builder.Property(b => b.TotalAmount)
                .IsRequired()
                .HasColumnName("total_amount")
                .HasColumnType("decimal(12,2)");

            builder.Property(b => b.PaymentMethod)
                .IsRequired()
                .HasColumnName("payment_method");

            builder.Property(b => b.CreatedAt)
                .IsRequired()
                .HasColumnName("created_at");

            builder.HasOne(b=> b.Profile)
                .WithMany(b=> b.Bookings)
                .HasForeignKey(b => b.ProfileId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(b=> b.Status)
                .WithMany(b=> b.Bookings)
                .HasForeignKey(b=> b.StatusId)
                .OnDelete(DeleteBehavior.Cascade);  
        }
    }
}
