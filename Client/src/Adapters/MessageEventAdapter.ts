export class MessageEventAdapter {
  public static ToArrayBuffer(msg: string): ArrayBuffer {
    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(msg);
    const messageLength = messageBytes.length;
    const buffer = new ArrayBuffer(1 + 4 + messageLength);
    const view = new DataView(buffer);

    let offset = 0;

    // set the header
    view.setUint8(offset, 0x01);
    offset++;

    //player id
    view.setUint32(offset, 12345, true);
    offset += 4;

    // string message
    const uint8Array = new Uint8Array(buffer);
    uint8Array.set(messageBytes, offset);

    return buffer;
  }
  public static FromArrayBuffer(buffer: ArrayBuffer): string {
    const view = new DataView(buffer);
    let offset = 0;

    // read the header
    const header = view.getUint8(offset);
    offset++;

    // read the player id
    const playerId = view.getUint32(offset, true);
    offset += 4;

    // read the string message
    const messageBytes = new Uint8Array(buffer, offset);
    const decoder = new TextDecoder();
    const message = decoder.decode(messageBytes);

    console.log(`Header: ${header}, Player ID: ${playerId}`);
    return message;
  }
}
