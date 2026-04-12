using System.Net;

namespace Core.Exceptions
{
    public class BusinessException : Exception
    {
        public HttpStatusCode Status { get; private set; }
        public string DescriptionStatus { get; private set; }

        public BusinessException(HttpStatusCode status, string descriptionStatus, string message) : base(message)
        {
            Status = status;
            DescriptionStatus = descriptionStatus;
        }
    }
}
