import { useEffect, useRef, useState } from "react";
import { MessageEventAdapter } from "../Adapters/MessageEventAdapter";
import { EventWebSocket } from "../Util/EvenWebSocket";
import { EventTypes } from "../Models/Events";
import { JoinEventAdapter } from "../Adapters/JoinEventAdapter";
import { DrawingEventAdapter } from "../Adapters/DrawingEventAdapter";
import type { changeEvent } from "../Models/DrawEvent";
import type { DrawingPanelRef } from "../Components/DrawingPanel";
import DrawingPanel from "../Components/DrawingPanel";
import ColorPicker from "../Components/ColorPicker";

const ws = new WebSocket("ws://localhost:8081");

// interface IndexPageProps {}
const IndexPage: React.FC = () => {
  const [color, setColor] = useState<string>("#000000");

  const drawingPanelRef = useRef<DrawingPanelRef>(null);
  const handlePixelsChange = (data: changeEvent) => {
    if (!ws.readyState) return;
    ws.send(DrawingEventAdapter.ToArrayBuffer(data));
  };

  useEffect(() => {
    ws.binaryType = "arraybuffer";

    ws.onopen = (event) => {
      console.log("WebSocket connection opened:", event);
    };

    ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        const webSocketEvent = new EventWebSocket(event.data);
        switch (webSocketEvent.type) {
          case EventTypes.CONNECTION: {
            const joinEvent = JoinEventAdapter.FromArrayBuffer(event.data);
            console.log(
              `Connection event - Success: ${joinEvent.success}, Player ID: ${joinEvent.playerId}`
            );
            // console.log(joinEvent.board);
            drawingPanelRef.current?.setPixelsFlat?.(joinEvent.board);

            break;
          }
          case EventTypes.MESSAGE: {
            const message = MessageEventAdapter.FromArrayBuffer(event.data);
            console.log("Received message:", message);
            break;
          }
          case EventTypes.DRAW: {
            const drawingData = DrawingEventAdapter.FromArrayBuffer(event.data);
            // console.log(drawingData);
            drawingPanelRef.current?.setPixelsFlat?.(drawingData);
            break;
          }
        }
      } else {
        console.log("Received non-binary message:", event.data);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <DrawingPanel
        ref={drawingPanelRef}
        onChange={handlePixelsChange}
        color={color}
      />
      <ColorPicker onChange={(color) => setColor(color)} />
    </div>
  );
};

export default IndexPage;
