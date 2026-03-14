using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Data.Configurations
{
    internal class AdventureImageConfiguration : IEntityTypeConfiguration<AdventureImage>
    {
        public void Configure(EntityTypeBuilder<AdventureImage> builder)
        {
            builder.ToTable("adventure_images");

            builder.HasKey(x=> x.Id);

            builder.Property(a => a.Id)
                .IsRequired()
                .HasColumnName("id");

            builder.Property(a => a.AdventureId)
                .IsRequired()
                .HasColumnName("adventure_id");

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

            builder.HasOne(a => a.Adventure)
                .WithMany(c => c.Images)
                .HasForeignKey(a => a.AdventureId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
