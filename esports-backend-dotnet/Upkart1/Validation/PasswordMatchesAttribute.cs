using System.ComponentModel.DataAnnotations;

namespace Upkart1.Validation
{
    [AttributeUsage(AttributeTargets.Class)]
    public class PasswordMatchesAttribute : ValidationAttribute
    {
        public override string FormatErrorMessage(string name)
        {
            return "Passwords do not match";
        }

        public override bool IsValid(object? value)
        {
            if (value == null) return true;
            
            // Use reflection to get password and confirmPassword properties
            var type = value.GetType();
            var passwordProperty = type.GetProperty("Password");
            var confirmPasswordProperty = type.GetProperty("ConfirmPassword");
            
            if (passwordProperty == null || confirmPasswordProperty == null)
                return true;
                
            var password = passwordProperty.GetValue(value) as string;
            var confirmPassword = confirmPasswordProperty.GetValue(value) as string;
            
            // Debug logging matching Spring backend
            Console.WriteLine($"PasswordMatches validation - password: {(password != null ? "[PRESENT]" : "null")}, " +
                            $"confirmPassword: {(confirmPassword != null ? "[PRESENT]" : "null")}");
            
            if (password == null || confirmPassword == null)
            {
                return true; // Let Required attribute handle null validation
            }
            
            bool isValid = password.Equals(confirmPassword);
            Console.WriteLine($"Passwords match: {isValid}");
            
            return isValid;
        }
    }
}