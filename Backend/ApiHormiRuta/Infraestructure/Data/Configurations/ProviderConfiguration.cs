using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Data.Configurations
{
    internal class ProviderConfiguration : IEntityTypeConfiguration<Provider>
    {
        public void Configure(EntityTypeBuilder<Provider> builder)
        {
            builder.ToTable("providers");
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Id).HasColumnName("id");
            builder.Property(p => p.ProfileId).HasColumnName("profile_id");
            builder.Property(p => p.BusinessName).HasColumnName("business_name").IsRequired();
            builder.Property(p => p.LicenseNumber).HasColumnName("license_number");
            builder.Property(p => p.IsVerified).HasColumnName("is_verified").HasDefaultValue(false);
        }
    }
}
