using Fleck;

namespace WS.Services;

public static class StateService
{
    private static readonly GameState _game;
    public static GameState Game => _game;

    static StateService()
    {
        _game = new GameState();
    }

    public static void BroadCastClients(byte[] data, IWebSocketConnection? socketOwner = null)
    {
        foreach (var player in _game.players)
        {
            var socket = player.Value.socket;
            if (socketOwner != null && socket.ConnectionInfo.Id == socketOwner.ConnectionInfo.Id)
                continue;
            socket.Send(data);
        }
    }
}
