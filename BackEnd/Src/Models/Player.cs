using Fleck;

namespace WS.Models;

public class Player
{
    public int PlayerID;
    public DateTime lastActive = DateTime.Now;
    public required IWebSocketConnection socket;
}
