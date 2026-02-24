namespace Upkart1.Helpers
{
    public static class S3KeyHelper
    {
        public static string Extract(string url)
        {
            if (!url.StartsWith("http")) return url;

            var index = url.IndexOf("kyc/");
            if (index < 0) return url;

            var key = url.Substring(index);
            return key.Contains("?") ? key[..key.IndexOf("?")] : key;
        }
    }
}
