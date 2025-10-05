using System.Numerics;
using Fleck;
using WS.Models;

namespace WS.Services;

public class GameState
{
    public static int MAX_NUM_PLAYER = 100;
    public readonly Dictionary<Guid, Player> players = [];

    private int playerCount = 0;

    public (int?, string) TryJoin(IWebSocketConnection socket)
    {
        playerCount++;
        if (playerCount >= MAX_NUM_PLAYER)
            return (null, "The server if full");

        Player player = new() { socket = socket, PlayerID = playerCount };
        var isAdded = players.TryAdd(socket.ConnectionInfo.Id, player);

        if (!isAdded)
            return (null, "Error while tying to add the player to the game");
        return (playerCount, string.Empty);
    }

    public bool Leave(Guid guid)
    {
        return players.Remove(guid);
    }
}
