import { JoinEventAdapter } from "../Adapters/JoinEventAdapter";
import { MessageEventAdapter } from "../Adapters/MessageEventAdapter";
import { EventTypes } from "../Models/Events";

export class EventWebSocket {
  constructor(event: ArrayBuffer) {
    this.event = event;
  }

  event: ArrayBuffer;

  public FromArrayBuffer = () => {
    const type = this.type;
    switch (type) {
      case EventTypes.CONNECTION:
        return JoinEventAdapter.FromArrayBuffer(this.event);
      case EventTypes.MESSAGE:
        return MessageEventAdapter.FromArrayBuffer(this.event);
      default:
        return null;
    }
  };

  public get raw(): ArrayBuffer {
    return this.event;
  }

  public get type(): EventTypes {
    const view = new DataView(this.event);
    const type = this.event.byteLength > 0 ? view.getUint8(0) : null;
    switch (type) {
      case 0x00:
        return EventTypes.CONNECTION;
      case 0x01:
        return EventTypes.MESSAGE;
      case 0x02:
        return EventTypes.DRAW;
      case 0x03:
        return EventTypes.USER_COUNT;
      default:
        return EventTypes.UNKNOWN;
    }
  }
}
