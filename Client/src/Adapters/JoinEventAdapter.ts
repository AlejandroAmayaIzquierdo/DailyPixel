import type { JoinEvent } from "../Models/JoinEvent";

export class JoinEventAdapter {
  public static FromArrayBuffer = (buffer: ArrayBuffer): JoinEvent => {
    const view = new DataView(buffer);

    const header = view.getUint8(0);

    const success = view.getUint8(1) === 1;
    const playerId = view.getUint32(2, true);

    return {
      header,
      success,
      playerId,
    };
  };
}
