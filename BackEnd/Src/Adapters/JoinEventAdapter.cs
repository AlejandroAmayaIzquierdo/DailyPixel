namespace WS.Adapters;

public class JoinEventAdapter
{
    public static byte[] CreatePacket(int playerID, bool success)
    {
        using var memoryStream = new MemoryStream();
        using BinaryWriter writer = new(memoryStream);

        byte header = 0x00; // join Event

        writer.Write(header);
        writer.Write(success); // success
        writer.Write(playerID);

        writer.Flush();
        return memoryStream.ToArray();
    }
}
