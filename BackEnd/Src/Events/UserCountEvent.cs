using Fleck;
using WS.Adapters;
using WS.Models;
using WS.Services;

namespace WS.Events;

public class UserCountEvent : BaseEventHandler<UserCountPacket>
{
    public override byte EventType => 0x03;

    public override Task Handle(UserCountPacket dto, IWebSocketConnection socket)
    {
        dto.Count = StateService.Game.players.Count;

        byte[] packet = UserCountEventAdapter.CreatePacket(dto.PlayerID, dto.Count);

        StateService.BroadCastClients(packet, socket);

        return Task.CompletedTask;
    }
}
