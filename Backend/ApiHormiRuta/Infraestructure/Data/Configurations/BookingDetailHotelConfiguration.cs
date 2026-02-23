using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Data.Configurations
{
    internal class BookingDetailHotelConfiguration : IEntityTypeConfiguration<BookingDetailHotel>
    {
        public void Configure(EntityTypeBuilder<BookingDetailHotel> builder)
        {
            builder.ToTable("booking_details_hotel");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .IsRequired()
                .HasColumnName("id");

            builder.Property(x => x.BookingId)
                .IsRequired()
                .HasColumnName("booking_id");

            builder.Property(x => x.RoomTypeId)
                .IsRequired()
                .HasColumnName("room_type_id");

            builder.Property(x => x.CheckIn)
                .IsRequired()
                .HasColumnName("check_in");

            builder.Property(x => x.CheckOut)
                .IsRequired()
                .HasColumnName("check_out");

            builder.Property(x => x.RoomCount)
                .IsRequired()
                .HasColumnName("room_count");

            builder.HasOne(x => x.Booking)
                .WithMany(b => b.BookingDetailHotels)
                .HasForeignKey(x => x.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.RoomType)
            .WithMany(x => x.BookingDetailHotels)
            .HasForeignKey(x => x.RoomTypeId)
            .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
