using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Data.Configurations
{
    internal class VariantValueConfiguration : IEntityTypeConfiguration<VariantValue>
    {
        public void Configure(EntityTypeBuilder<VariantValue> builder)
        {
            builder.ToTable("variant_values");

            builder.HasKey(x => x.ProductVariantId);
            builder.HasKey(x=> x.AttributeValueId);

            builder.Property(x => x.ProductVariantId)
                .IsRequired()
                .HasColumnName("product_variant_id");

            builder.Property(x => x.AttributeValueId)
                .IsRequired()
                .HasColumnName("attribute_value_id");

            builder.HasOne(x => x.ProductVariant)
                .WithMany(x => x.VariantValues)
                .HasForeignKey(x => x.ProductVariantId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(x => x.AttributeValue)
                .WithMany(x => x.VariantValues)
                .HasForeignKey(x => x.AttributeValueId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
