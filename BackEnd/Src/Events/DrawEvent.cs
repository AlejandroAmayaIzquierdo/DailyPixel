using Fleck;
using WS.Models;
using WS.Services;
using WS.Util;

namespace WS.Events;

public class DrawEvent : BaseEventHandler<DrawPacket>
{
    public override byte EventType => 0x02;

    public override Task Handle(DrawPacket dto, IWebSocketConnection socket)
    {
        if (dto.Color == null)
            return Task.CompletedTask;

        StateService.Game.players.TryGetValue(socket.ConnectionInfo.Id, out Player? player);
        if (player == null)
            return Task.CompletedTask;

        StateService.Game.DrawOnBoard(dto.X, dto.Y, dto.Color ?? "");

        player.lastActive = DateTime.Now;

        string board = StateService.Game.ToString();

        var package = DrawEventAdapter.CreatePacket(dto.PlayerID, board);

        StateService.BroadCastClients(package, socket);

        return Task.CompletedTask;
    }
}
