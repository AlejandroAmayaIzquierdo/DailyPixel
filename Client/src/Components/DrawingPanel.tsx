import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as fabric from "fabric";
import type { changeEvent } from "../Models/DrawEvent";

const PIXEL_SIZE = 20;
const BOARD_WIDTH = 1000;
const BOARD_HEIGHT = 1000;

interface DrawingPanelProps {
  color?: string;
  onChange?: (data: changeEvent) => void;
}

export interface DrawingPanelRef {
  getPixels: () => string[][];
  setPixels?: (pixels: string[][]) => void;
  setPixelsFlat?: (pixels: string[]) => void;
}

const DrawingPanel = forwardRef<DrawingPanelRef, DrawingPanelProps>(
  ({ onChange, color }, ref) => {
    const canvasEl = useRef<HTMLCanvasElement | null>(null);

    const isDrawing = useRef(false);
    const isDragging = useRef(false);
    const lastPosition = useRef({ x: 0, y: 0 });

    const canvasRef = useRef<fabric.Canvas>(new fabric.Canvas());

    const colorRef = useRef<string>(color || "#000000");
    useEffect(() => {
      if (color) colorRef.current = color;
    }, [color]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isMouseEvent = (e: any): e is MouseEvent =>
      "clientX" in e && "clientY" in e;

    const updateCanvasContext = (canvas: fabric.Canvas) => {
      canvas.on("mouse:down", (event) => {
        const e = event.e;

        if (e.altKey && isMouseEvent(e)) {
          isDragging.current = true;
          lastPosition.current = { x: e.clientX, y: e.clientY };
          return;
        }
        isDrawing.current = true;
        drawPixel(canvas, event.e as fabric.TPointerEvent);
      });

      canvas.on("mouse:move", (event) => {
        if (isDragging.current) {
          const e = event.e;
          if (!isMouseEvent(e)) return;
          const vpt = canvas.viewportTransform;
          vpt[4] += e.clientX - lastPosition.current.x;
          vpt[5] += e.clientY - lastPosition.current.y;

          clampPan(canvas);

          canvas.requestRenderAll();
          lastPosition.current = { x: e.clientX, y: e.clientY };
          return;
        }
        if (isDrawing.current)
          drawPixel(canvas, event as unknown as fabric.TPointerEvent);
      });
      canvas.on("mouse:up", () => {
        isDrawing.current = false;
        isDragging.current = false;
      });

      canvas.on("mouse:wheel", (event) => {
        const delta = event.e.deltaY;
        let zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        zoom = Math.min(Math.max(zoom, 0.2), 20);
        const point = new fabric.Point(event.e.offsetX, event.e.offsetY);

        canvas.zoomToPoint(point, zoom);

        clampPan(canvas);

        event.e.preventDefault();
        event.e.stopPropagation();
      });
    };

    const drawPixel = (canvas: fabric.Canvas, event: fabric.TPointerEvent) => {
      const pointer = canvas.getPointer(event);
      const x = Math.floor(pointer.x / PIXEL_SIZE) * PIXEL_SIZE;
      const y = Math.floor(pointer.y / PIXEL_SIZE) * PIXEL_SIZE;

      if (x < 0 || x > BOARD_WIDTH * PIXEL_SIZE) return;
      if (y < 0 || y > BOARD_HEIGHT * PIXEL_SIZE) return;
      const rect = new fabric.Rect({
        left: x,
        top: y,
        width: PIXEL_SIZE,
        height: PIXEL_SIZE,
        fill: colorRef.current || "#000",
        selectable: false,
        evented: false,
      });
      canvas.add(rect);
      const row = Math.floor(x / PIXEL_SIZE);
      const col = Math.floor(y / PIXEL_SIZE);
      // pixels.current[xPixel][yPixel] = "#000";
      onChange?.({ x: row, y: col, color: colorRef.current || "#000" });
    };

    const clampPan = (canvas: fabric.Canvas) => {
      const vpt = canvas.viewportTransform!;
      const zoom = canvas.getZoom();

      // Definir límites (en coordenadas del lienzo)
      const limitX = BOARD_WIDTH * PIXEL_SIZE * zoom - window.innerWidth;
      const limitY = BOARD_HEIGHT * PIXEL_SIZE * zoom - window.innerHeight;

      // Limita el desplazamiento
      vpt[4] = Math.min(0, Math.max(vpt[4], -limitX));
      vpt[5] = Math.min(0, Math.max(vpt[5], -limitY));
    };

    useEffect(() => {
      if (!canvasEl.current) return;
      const options = {};
      const canvas = new fabric.Canvas(canvasEl.current, options);
      canvas.selection = false;

      canvasRef.current = canvas;

      updateCanvasContext(canvas);

      return () => {
        canvas.dispose();
      };
    }, []);

    useImperativeHandle(ref, () => ({
      getPixels: () => {
        return [];
      },

      setPixels: (pixelsToDraw: string[][]) => {
        if (!canvasEl.current) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.clear();

        for (let r = 0; r < BOARD_WIDTH; r++) {
          for (let c = 0; c < BOARD_HEIGHT; c++) {
            const colorData = pixelsToDraw[r][c];
            if (colorData !== "#fff") {
              const rect = new fabric.Rect({
                left: c * PIXEL_SIZE,
                top: r * PIXEL_SIZE,
                width: PIXEL_SIZE,
                height: PIXEL_SIZE,
                fill: colorData,
                selectable: false,
                evented: false,
              });
              canvas.add(rect);
            }
          }
        }
        canvas.requestRenderAll();
      },

      setPixelsFlat: (flatPixels: string[]) => {
        if (flatPixels.length !== BOARD_WIDTH * BOARD_HEIGHT) {
          throw new Error("Invalid pixel array length");
        }
        const newPixels2D: string[][] = [];
        for (let r = 0; r < BOARD_WIDTH; r++) {
          const row: string[] = flatPixels.slice(
            r * BOARD_HEIGHT,
            (r + 1) * BOARD_HEIGHT
          );
          newPixels2D.push(row);
        }
        (ref as React.RefObject<DrawingPanelRef>).current?.setPixels?.(
          newPixels2D
        );
      },
    }));

    return (
      <canvas
        width={window.innerWidth}
        height={window.innerHeight}
        ref={canvasEl}
      />
    );
  }
);

DrawingPanel.displayName = "DrawingPanel";

export default DrawingPanel;
