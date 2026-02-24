using System.ComponentModel.DataAnnotations;

namespace Upkart1.Validation
{
    public class FutureDateAttribute : ValidationAttribute
    {
        public FutureDateAttribute() : base("Deadline must be in the future")
        {
        }

        public override bool IsValid(object? value)
        {
            if (value is DateTime dateTime)
            {
                return dateTime > DateTime.Now;
            }
            return false;
        }
    }
}