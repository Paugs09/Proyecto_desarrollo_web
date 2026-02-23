using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Data.Configurations
{
    internal class RoomTypeConfiguration : IEntityTypeConfiguration<RoomType>
    {
        public void Configure(EntityTypeBuilder<RoomType> builder)
        {
            builder.ToTable("room_types");

            builder.HasKey(rt => rt.Id);

            builder.Property(rt => rt.Id)
                .IsRequired()
                .HasColumnName("id");

            builder.Property(rt => rt.HotelId)
                .IsRequired()
                .HasColumnName("hotel_id");

            builder.Property(rt => rt.Name)
                .IsRequired()
                .HasColumnName("name");

            builder.Property(rt => rt.Capacity)
                .IsRequired()
                .HasColumnName("capacity");

            builder.Property(rt => rt.PricePerNight)
                .IsRequired()
                .HasColumnName("price_per_night")
                .HasColumnType("decimal(12,2)");

            builder.Property(rt => rt.TotalStock)
                .IsRequired()
                .HasColumnName("total_stock");
        }
    }
}
