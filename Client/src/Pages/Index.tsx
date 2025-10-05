import { useEffect, useRef } from "react";
import DrawingPanel, { type DrawingPanelRef } from "../Components/DrawingPanel";
import { MessageEventAdapter } from "../Adapters/MessageEventAdapter";
import { EventWebSocket } from "../Util/EvenWebSocket";
import { EventTypes } from "../Models/Events";
import { JoinEventAdapter } from "../Adapters/JoinEventAdapter";
import { DrawingEventAdapter } from "../Adapters/DrawingEventAdapter";

const ws = new WebSocket("ws://localhost:8081");

// interface IndexPageProps {}
const IndexPage: React.FC = () => {
  const drawingPanelRef = useRef<DrawingPanelRef>(null);
  const handlePixelsChange = (pixels: string[][]) => {
    if (!ws.readyState) return;
    const data = DrawingEventAdapter.ToArrayBuffer(pixels);
    ws.send(data);
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
            break;
          }
          case EventTypes.MESSAGE: {
            const message = MessageEventAdapter.FromArrayBuffer(event.data);
            console.log("Received message:", message);
            break;
          }
          case EventTypes.DRAW: {
            const drawingData = DrawingEventAdapter.FromArrayBuffer(event.data);
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
    <div className="flex justify-center items-center h-screen">
      <button
        type="button"
        className="btn btn-primary mb-4"
        onClick={() => {
          console.log("Sending message to server...");
          const message = "Hello, Server!";
          const data = MessageEventAdapter.ToArrayBuffer(message);
          ws.send(data);
        }}
      >
        Send Message
      </button>
      <DrawingPanel ref={drawingPanelRef} onChange={handlePixelsChange} />
    </div>
  );
};

export default IndexPage;
