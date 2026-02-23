using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Data.Configurations
{
    internal class HotelConfiguration : IEntityTypeConfiguration<Hotel>
    {
        public void Configure(EntityTypeBuilder<Hotel> builder)
        {
            builder.ToTable("hotels");

            builder.HasKey(h => h.Id);

            builder.Property(h => h.Id)
                .IsRequired()
                .HasColumnName("id");

            builder.Property(h => h.Name)
                .IsRequired()
                .HasColumnName("name");

            builder.Property(h => h.Stars)
                .IsRequired()
                .HasColumnName("stars");

            builder.Property(h => h.CheckInTime)
                .IsRequired()
                .HasColumnName("check_in_time");

            builder.Property(h => h.CheckOutTime)
                .IsRequired()
                .HasColumnName("check_out_time");

            builder.Property(h => h.Address)
                .IsRequired()
                .HasColumnName("address");

            builder.Property(h => h.City)
                .IsRequired()
                .HasColumnName("city");
        }
    }
}
