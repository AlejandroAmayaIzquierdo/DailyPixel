using Fleck;
using WS.Models;
using WS.Services;

namespace WS.Events;

public class MessageEvent : BaseEventHandler<MessagePacket>
{
    public override byte EventType => 0x01;

    public override Task Handle(MessagePacket dto, IWebSocketConnection socket)
    {
        byte[] packet = MessageEventAdapter.CreatePacket(dto.PlayerID, "Hello from backend!");

        StateService.BroadCastClients(packet, socket);

        return Task.CompletedTask;
    }
}
