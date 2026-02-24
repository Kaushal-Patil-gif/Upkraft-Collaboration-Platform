using System.ComponentModel.DataAnnotations;

namespace Upkart1.Validation
{
    public class FutureDateStringAttribute : ValidationAttribute
    {
        public FutureDateStringAttribute() : base("Deadline must be in the future")
        {
        }

        public override bool IsValid(object? value)
        {
            if (value is string dateString && DateTime.TryParse(dateString, out DateTime dateTime))
            {
                return dateTime > DateTime.Now;
            }
            return false;
        }
    }
}