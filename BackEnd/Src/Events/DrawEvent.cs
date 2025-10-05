using System.Text;
using Fleck;
using WS.Models;
using WS.Services;

namespace WS.Events;

public class DrawEvent : BaseEventHandler<DrawPacket>
{
    public override byte EventType => 0x02;

    public override Task Handle(DrawPacket dto, IWebSocketConnection socket)
    {
        if (dto.data is null)
            return Task.CompletedTask;
        var packet = DrawEventAdapter.CreatePacket(dto.PlayerID, dto.data);
        StateService.BroadCastClients(packet, socket);

        return Task.CompletedTask;
    }
}
