using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Data.Configurations
{
    internal class UserProfileConfiguration : IEntityTypeConfiguration<UserProfile>
    {
        public void Configure(EntityTypeBuilder<UserProfile> builder)
        {
            builder.ToTable("users");

            builder.HasKey(u => u.Id);

            builder.Property(u=> u.Id)
                .IsRequired()
                .HasColumnName("id");

            builder.Property(u => u.FirstName)
                .IsRequired()
                .HasColumnName("first_name");

            builder.Property(u => u.LastName)
                .IsRequired(false)
                .HasColumnName("last_name");

            builder.Property(u => u.Email)
                .IsRequired()
                .HasColumnName("email");

            builder.Property(u => u.PhoneNumber)
                .IsRequired(false)
                .HasColumnName("phone");

            builder.Property(u => u.ShippingAddress)
                .IsRequired(false)
                .HasColumnName("shipping_address");

            builder.Property(u => u.CreatedDate)
                .IsRequired()
                .HasColumnName("created_at");

            builder.Property(u => u.RoleId)
                .IsRequired()
                .HasColumnName("role_id");

            builder.Property(u => u.Avatar)
                .IsRequired(false)
                .HasColumnName("avatar");

            builder.HasOne(x => x.Role)
                .WithMany(x => x.UserProfiles)
                .HasForeignKey(x => x.RoleId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
