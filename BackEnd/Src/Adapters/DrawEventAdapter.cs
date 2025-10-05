public static class DrawEventAdapter
{
    public static byte[] CreatePacket(int playerID, string data)
    {
        using var memoryStream = new MemoryStream();
        using BinaryWriter writer = new(memoryStream);

        byte header = 0x02; // draw Event
        byte[] dataBytes = System.Text.Encoding.UTF8.GetBytes(data);

        writer.Write(header);
        writer.Write(playerID);
        writer.Write(dataBytes);

        return memoryStream.ToArray();
    }
}
