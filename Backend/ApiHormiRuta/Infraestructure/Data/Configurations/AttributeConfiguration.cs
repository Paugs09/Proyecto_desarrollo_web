using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Data.Configurations
{
    internal class AttributeConfiguration : IEntityTypeConfiguration<Core.Entities.Attribute>
    {
        public void Configure(EntityTypeBuilder<Core.Entities.Attribute> builder)
        {
            builder.ToTable("attributes");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .IsRequired()
                .HasColumnName("id");

            builder.Property(x => x.Name)
                .IsRequired()
                .HasColumnName("name");

            builder.Property(x => x.CreatedAt)
                .IsRequired()
                .HasColumnName("created_at");
        }
    }
}