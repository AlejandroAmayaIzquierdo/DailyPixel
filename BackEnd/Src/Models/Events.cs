using WS.Util;

namespace WS.Models;

public class BaseEvent
{
    [BinaryData(0, 8)]
    public byte Header { get; set; }

    [BinaryData(1, 32)]
    public int PlayerID { get; set; }
}

public class MessagePacket : BaseEvent
{
    [BinaryData(2, -1)]
    public string? Message { get; set; }
}

public class DrawPacket : BaseEvent
{
    [BinaryData(2, -1)]
    public string? data { get; set; }
}
