import { decode, encode } from "../Util/RunLengthEncoding";

export class DrawingEventAdapter {
  // public static FromArrayBuffer(buffer: ArrayBuffer): string {
  //     const view = new DataView(buffer);
  // }
  public static ToArrayBuffer(pixels: string[][]): ArrayBuffer {
    const encoder = new TextEncoder();

    const header = 0x02;

    const data = encode(pixels);
    console.log(data.join(","));
    const messageBytes = encoder.encode(data.join(","));
    const messageLength = messageBytes.length;
    const buffer = new ArrayBuffer(1 + 4 + messageLength);
    const view = new DataView(buffer);

    let offset = 0;

    // set the header
    view.setUint8(offset, header);
    offset++;

    //player id
    view.setUint32(offset, 12345, true);
    offset += 4;

    // string message
    const uint8Array = new Uint8Array(buffer);
    uint8Array.set(messageBytes, offset);

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

    const data = message.split(",");

    return decode(data);
  }
}
