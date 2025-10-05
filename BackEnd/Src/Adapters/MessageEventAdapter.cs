public static class MessageEventAdapter
{
    public static byte[] CreatePacket(int playerID, string message)
    {
        using var memoryStream = new MemoryStream();
        using BinaryWriter writer = new(memoryStream);

        byte header = 0x01; // message Event
        byte[] messageBytes = System.Text.Encoding.UTF8.GetBytes(message);
        int messageLength = messageBytes.Length;

        writer.Write(header);
        writer.Write(playerID);
        writer.Write(messageLength);
        writer.Write(messageBytes);

        return memoryStream.ToArray();
    }
}
