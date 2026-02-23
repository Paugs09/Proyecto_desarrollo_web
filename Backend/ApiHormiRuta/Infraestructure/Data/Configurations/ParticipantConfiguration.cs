using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Data.Configurations
{
    internal class ParticipantConfiguration : IEntityTypeConfiguration<Participant>
    {
        public void Configure(EntityTypeBuilder<Participant> builder)
        {
            builder.ToTable("participants");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Id)
                .IsRequired()
                .HasColumnName("id");

            builder.Property(p => p.BookingId)
                .HasColumnName("booking_id");

            builder.Property(p => p.FirstName)
                .IsRequired()
                .HasColumnName("first_name");

            builder.Property(p => p.MiddleName)
                .IsRequired(false)
                .HasColumnName("middle_name");

            builder.Property(p => p.LastName)
                .IsRequired()
                .HasColumnName("last_name");

            builder.Property(p => p.IdNumber)
                .IsRequired(false)
                .HasColumnName("id_number");

            builder.Property(p => p.MedicalData)
                .HasColumnName("medical_data")
                .HasColumnType("jsonb");

            builder.Property(p => p.WaiverSigned)
                .HasColumnName("waiver_signed");
        }
    }
}
