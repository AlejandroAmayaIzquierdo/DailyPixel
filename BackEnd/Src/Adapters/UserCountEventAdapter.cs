namespace WS.Adapters;

public class UserCountEventAdapter
{
    public static byte[] CreatePacket(int playerID, int count)
    {
        using var memoryStream = new MemoryStream();
        using BinaryWriter writer = new(memoryStream);

        byte header = 0x03; // user count Event
        writer.Write(header);
        writer.Write(playerID);
        writer.Write(count);

        writer.Flush();
        return memoryStream.ToArray();
    }
}
