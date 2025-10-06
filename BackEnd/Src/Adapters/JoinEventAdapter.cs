using WS.Services;

namespace WS.Adapters;

public class JoinEventAdapter
{
    public static byte[] CreatePacket(int playerID, bool success)
    {
        using var memoryStream = new MemoryStream();
        using BinaryWriter writer = new(memoryStream);

        byte header = 0x00; // join Event
        writer.Write(header);
        writer.Write(playerID);
        writer.Write(success ? (byte)1 : (byte)0); // success
        byte[] gameBytes = System.Text.Encoding.UTF8.GetBytes(StateService.Game.ToString().Trim());
        writer.Write(gameBytes);

        writer.Flush();
        return memoryStream.ToArray();
    }
}
