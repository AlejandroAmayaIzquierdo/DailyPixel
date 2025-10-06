import type { changeEvent } from "../Models/DrawEvent";
import { decode } from "../Util/RunLengthEncoding";

export class DrawingEventAdapter {
  // public static FromArrayBuffer(buffer: ArrayBuffer): string {
  //     const view = new DataView(buffer);
  // }
  public static ToArrayBuffer(data: changeEvent): ArrayBuffer {
    const encoder = new TextEncoder();

    const header = 0x02;

    const colorBytes = encoder.encode(data.color);
    const colorLength = colorBytes.length;
    const buffer = new ArrayBuffer(1 + 4 + 2 + 2 + colorLength);
    const view = new DataView(buffer);

    let offset = 0;

    // set the header
    view.setUint8(offset, header);
    offset++;

    //player id
    view.setUint32(offset, 12345, true);
    offset += 4;

    //x coordinates
    view.setUint16(offset, data.x, true);
    offset += 2;

    //y coordinates
    view.setUint16(offset, data.y, true);
    offset += 2;

    //color message
    const uint8Array = new Uint8Array(buffer);
    uint8Array.set(colorBytes, offset);

    return buffer;
  }
  public static FromArrayBuffer(buffer: ArrayBuffer): string[] {
    const decoder = new TextDecoder();
    const view = new DataView(buffer);

    const header = view.getUint8(0);
    if (header !== 0x02) throw new Error("Invalid header for DrawingEvent");

    const playerId = view.getUint32(1, true);
    console.log("Player ID:", playerId);

    const messageBytes = new Uint8Array(buffer, 5);
    const message = decoder.decode(messageBytes);

    // console.log(message);

    const data = message.split(",");

    // console.log(data);

    return decode(data);
  }
}
