using Core.Entities;
using Core.Enumerations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Reflection.Emit;

namespace Infraestructure.Data.Configurations
{
    internal class AdventureConfiguration : IEntityTypeConfiguration<Adventure>
    {
        public void Configure(EntityTypeBuilder<Adventure> builder)
        {
            builder.ToTable("adventures");
            
            builder.HasKey(a => a.Id);

            builder.Property(a => a.Id)
                .IsRequired()
                .HasColumnName("id");

            builder.Property(a => a.CategoryId)
                .IsRequired()
                .HasColumnName("category_id");

            builder.Property(a => a.Name)
                .IsRequired()
                .HasColumnName("name").IsRequired();

            builder.Property(a=> a.Description)
                .IsRequired()
                .HasColumnName("description");

            builder.Property(a => a.Difficulty)
                .IsRequired()
                .HasColumnType("difficulty_level")
                .HasColumnName("difficulty");

            builder.Property(a => a.Duration)
                .IsRequired()
                .HasColumnName("duration");

            builder.Property(a => a.MinAge)
                .IsRequired()
                .HasColumnName("min_age");

            builder.Property(a => a.PhysicalRequirements)
                .IsRequired(false)
                .HasColumnName("physical_requirements");

            builder.HasOne(a=> a.Category)
                .WithMany(c => c.Adventures)
                .HasForeignKey(a => a.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
