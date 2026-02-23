using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Data.Configurations
{
    internal class BookingDetailAdventureConfiguration : IEntityTypeConfiguration<BookingDetailAdventure>
    {
        public void Configure(EntityTypeBuilder<BookingDetailAdventure> builder)
        {
            builder.ToTable("booking_details_adventure");

            builder.HasKey(bda => bda.Id);

            builder.Property(bda => bda.Id)
                .IsRequired()
                .HasColumnName("id");

            builder.Property(bda => bda.BookingId)
                .IsRequired()
                .HasColumnName("booking_id");

            builder.Property(bda => bda.SlotId)
                .IsRequired()
                .HasColumnName("slot_id");

            builder.Property(bda => bda.AdultCount)
                .IsRequired()
                .HasColumnName("adult_count");

            builder.Property(bda => bda.ChildCount)
                .IsRequired(false)
                .HasColumnName("child_count");

            // Relaciones
            builder.HasOne(bda => bda.Booking)
                .WithMany(bda => bda.BookingDetailAdventures)
                .HasForeignKey(bda => bda.BookingId);

            builder.HasOne(bda => bda.AdventureSlot)
                .WithMany(bda => bda.BookingDetailAdventures)
                .HasForeignKey(bda => bda.SlotId);
        }
    }
}
