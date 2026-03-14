using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Data.Configurations
{
    internal class HotelImageConfiguration : IEntityTypeConfiguration<HotelImage>
    {
        public void Configure(EntityTypeBuilder<HotelImage> builder)
        {
            builder.ToTable("hotel_images");

            builder.HasKey(x=> x.Id);

            builder.Property(a => a.Id)
                .IsRequired()
                .HasColumnName("id");

            builder.Property(a => a.HotelId)
                .IsRequired()
                .HasColumnName("hotel_id");

            builder.Property(a => a.ImageUrl)
                .IsRequired()
                .HasColumnName("image_url");

            builder.Property(a => a.IsPrimary)
                .IsRequired()
                .HasColumnName("is_primary");

            builder.Property(a => a.DisplayOrder)
                .IsRequired()
                .HasColumnName("display_order");

            builder.Property(a => a.CreatedAt)
                .IsRequired()
                .HasColumnName("created_at");

            builder.HasOne(a => a.Hotel)
                .WithMany(c => c.Images)
                .HasForeignKey(a => a.HotelId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
