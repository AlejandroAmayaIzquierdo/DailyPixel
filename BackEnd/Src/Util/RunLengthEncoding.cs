namespace WS.Util;

public static class RunLengthEncoding
{
    public static string[] Encode(string[,] values)
    {
        var flattenedValues = values.Cast<string>().ToArray();

        if (flattenedValues is null)
            return [];

        List<string> encoded = [];

        int count = 1;
        for (int i = 1; i <= flattenedValues.Length; i++)
        {
            if (i < flattenedValues.Length && flattenedValues[i] == flattenedValues[i - 1])
                count++;
            else
            {
                encoded.AddRange([count.ToString(), flattenedValues[i - 1]]);
                count = 1;
            }
        }

        return [.. encoded];
    }
}
