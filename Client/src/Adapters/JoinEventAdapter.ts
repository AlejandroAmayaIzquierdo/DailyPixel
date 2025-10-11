import type { JoinEvent } from "../Models/JoinEvent";
import { decode } from "../Util/RunLengthEncoding";

export class JoinEventAdapter {
  public static FromArrayBuffer = (buffer: ArrayBuffer): JoinEvent => {
    const decoder = new TextDecoder();
    const view = new DataView(buffer);

    let offset = 0;

    const header = view.getUint8(offset++);
    const success = view.getUint8(offset++) === 1;

    const playerId = view.getUint32(offset, true);
    offset += 4;

    const playerCount = view.getUint32(offset, true);
    offset += 4;

    // ahora el offset está correctamente en 6
    const boardBytes = new Uint8Array(buffer, offset);
    const boardMessage = decoder.decode(boardBytes);

    return {
      header,
      success,
      playerId,
      playerCount,
      board: decode(boardMessage.split(",")),
    };
  };
}
