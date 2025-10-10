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
    [BinaryData(2, 16)]
    public short X { get; set; }

    [BinaryData(3, 16)]
    public short Y { get; set; }

    [BinaryData(4, -1)]
    public string? Color { get; set; }
}

public class UserCountPacket : BaseEvent
{
    [BinaryData(2, 32)]
    public int Count { get; set; }
}
