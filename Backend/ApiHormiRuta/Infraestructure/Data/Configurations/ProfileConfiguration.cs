using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Data.Configurations
{
    internal class ProfileConfiguration : IEntityTypeConfiguration<Profile>
    {
        public void Configure(EntityTypeBuilder<Profile> builder)
        {
            builder.ToTable("profiles");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Id)
                .IsRequired()
                .HasColumnName("id");

            builder.Property(p => p.FirstName)
                .IsRequired()
                .HasColumnName("first_name");

            builder.Property(p=> p.MiddleName)
                .IsRequired(false)
                .HasColumnName("middle_name");

            builder.Property(p => p.LastName)
                .IsRequired()
                .HasColumnName("last_name");

            builder.Property(p => p.Phone)
                .IsRequired()
                .HasColumnName("phone");

            builder.Property(p => p.IdNumber)
                .IsRequired()
                .HasColumnName("id_number");

            builder.Property(p => p.AvatarUrl)
                .IsRequired(false)
                .HasColumnName("avatar_url");

            builder.Property(p => p.CreatedAt)
                .IsRequired()
                .HasColumnName("created_at");
        }
    }
}
