using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Entities
{
    public class HotelImage : Image
    {
        public Guid HotelId { get; set; }

        public virtual Hotel Hotel { get; set; } = null!;
    }
}
