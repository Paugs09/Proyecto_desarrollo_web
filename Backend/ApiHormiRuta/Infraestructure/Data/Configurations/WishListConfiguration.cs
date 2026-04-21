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

            builder.Property(x => x.ProductId)
                .IsRequired()
                .HasColumnName("product_id");

            builder.Property(x => x.UserId)
                .IsRequired()
                .HasColumnName("user_id");

            builder.Property(x => x.CreatedAt)
                .IsRequired()
                .HasColumnName("created_at");

            builder.HasOne(x => x.Product)
                .WithMany(x => x.WishLists)
                .HasForeignKey(x => x.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.User)
                .WithMany(x => x.WishLists)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
