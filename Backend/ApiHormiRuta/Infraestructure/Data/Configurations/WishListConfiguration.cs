using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Data.Configurations
{
    internal class WishListConfiguration : IEntityTypeConfiguration<WishList>
    {
        public void Configure(EntityTypeBuilder<WishList> builder)
        {
            builder.ToTable("wish_list");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .IsRequired()
                .HasColumnName("id");

            builder.Property(x => x.ProductVariantId)
                .IsRequired()
                .HasColumnName("product_variant_id");

            builder.Property(x => x.UserId)
                .IsRequired()
                .HasColumnName("user_id");

            builder.Property(x => x.CreatedAt)
                .IsRequired()
                .HasColumnName("created_at");

            builder.HasOne(x => x.ProductVariant)
                .WithMany(x => x.WishLists)
                .HasForeignKey(x => x.ProductVariantId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.User)
                .WithMany(x => x.WishLists)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
