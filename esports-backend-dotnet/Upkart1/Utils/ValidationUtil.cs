using System.Text.RegularExpressions;

namespace Upkart1.Utils
{
    public static class ValidationUtil
    {
        private static readonly Regex EMAIL_PATTERN = new(@"^[A-Za-z0-9+_.-]+@(.+)$", RegexOptions.Compiled);
        private static readonly Regex NAME_PATTERN = new(@"^[a-zA-Z\s]{2,50}$", RegexOptions.Compiled);
        
        public static bool IsValidEmail(string? email)
        {
            return email != null && EMAIL_PATTERN.IsMatch(email);
        }
        
        public static bool IsValidName(string? name)
        {
            return name != null && NAME_PATTERN.IsMatch(name.Trim());
        }
        
        public static string? SanitizeInput(string? input)
        {
            if (input == null) return null;
            return Regex.Replace(input.Trim(), @"[<>""'&]", "");
        }
    }
}