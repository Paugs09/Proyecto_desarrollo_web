using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Data.Configurations
{
    internal class AdventureSlotConfiguration : IEntityTypeConfiguration<AdventureSlot>
    {
        public void Configure(EntityTypeBuilder<AdventureSlot> builder)
        {
            builder.ToTable("adventure_slots");

            builder.HasKey(s => s.Id);

            builder.Property(s => s.Id)
                .IsRequired()
                .HasColumnName("id");

            builder.Property(s=> s.AdventureId)
                .IsRequired()
                .HasColumnName("adventure_id");

            builder.Property(s => s.StartTime)
                .IsRequired()
                .HasColumnName("start_time");

            builder.Property(s => s.TotalCapacity)
                .IsRequired()
                .HasColumnName("total_capacity");

            builder.Property(s => s.AvailableCapacity)
                .IsRequired()
                .HasColumnName("available_capacity");

            builder.Property(s => s.PricePerPerson)
                .IsRequired()
                .HasColumnName("price_per_person")
                .HasColumnType("decimal(12,2)");

            builder.HasOne(s => s.Adventure)
                .WithMany(s=> s.AdventureSlots)
                .HasForeignKey(s => s.AdventureId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
