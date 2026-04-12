using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Data.Configurations
{
    internal class AttributeValueConfiguration : IEntityTypeConfiguration<AttributeValue>
    {
        public void Configure(EntityTypeBuilder<AttributeValue> builder)
        {
            builder.ToTable("attribute_values");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .IsRequired()
                .HasColumnName("id");

            builder.Property(x => x.AttributeId)
                .IsRequired()
                .HasColumnName("attribute_id");

            builder.Property(x => x.Value)
                .IsRequired()
                .HasColumnName("value");

            builder.Property(x => x.CreatedAt)
                .IsRequired()
                .HasColumnName("created_at");

            builder.HasOne(x => x.Attribute)
                .WithMany(x => x.AttributeValues)
                .HasForeignKey(x => x.AttributeId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}