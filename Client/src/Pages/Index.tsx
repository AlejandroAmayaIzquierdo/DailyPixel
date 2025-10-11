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
import UserCounter from "../Components/UserCounter";
import { VITE_WEBSOCKET_URL } from "../constants";

const ws = new WebSocket(VITE_WEBSOCKET_URL ?? "ws://localhost:8080");

// interface IndexPageProps {}
const IndexPage: React.FC = () => {
  const [color, setColor] = useState<string>("#000000");

  const playerId = useRef<number | null>(null);
  const [usersConnected, setUsersConnected] = useState(1);

  const drawingPanelRef = useRef<DrawingPanelRef>(null);
  const handlePixelsChange = (data: changeEvent) => {
    if (!ws.readyState) return;

    if (playerId.current === null) return;
    ws.send(DrawingEventAdapter.ToArrayBuffer(playerId.current, data));
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
              `Connection event - Success: ${joinEvent.success}, Player ID: ${joinEvent.playerId}, Player Count: ${joinEvent.playerCount}`
            );
            playerId.current = joinEvent.playerId;

            console.log("User connected:", joinEvent.playerId);
            console.log("Total users connected:", joinEvent.playerCount);

            setUsersConnected(joinEvent.playerCount ?? 1);

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
          case EventTypes.USER_COUNT: {
            const view = new DataView(event.data);
            const count = view.getUint8(1 + 4); // after header and player id
            setUsersConnected(count);
            break;
          }
        }
      } else {
        console.log("Received non-binary message:", event.data);
      }
    };

    const handleBeforeUnload = () => {
      console.log("Closing WebSocket connection");
      console.log(ws.readyState);
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
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
      <UserCounter count={usersConnected ?? 1} />
    </div>
  );
};

export default IndexPage;
