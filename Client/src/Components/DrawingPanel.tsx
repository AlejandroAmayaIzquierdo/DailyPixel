import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as fabric from "fabric";
import type { changeEvent } from "../Models/DrawEvent";

const PIXEL_SIZE = 20;
const BOARD_WIDTH = 500;
const BOARD_HEIGHT = 500;

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

    const isPanning = useRef(false);

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
        // console.log("Mouse down event:", event);
        const e = event.e;
        if (!isMouseEvent(e)) return;
        if (e.altKey || e.button === 1) {
          isDragging.current = true;
          lastPosition.current = { x: e.clientX, y: e.clientY };
          return;
        }

        if (e.button === 0) {
          isDrawing.current = true;
          drawPixel(canvas, event.e as fabric.TPointerEvent);
        }
      });

      canvas.on("mouse:move", (event) => {
        if (isDragging.current) {
          const e = event.e;
          if (!isMouseEvent(e)) return;
          const vpt = canvas.viewportTransform;
          vpt[4] += e.clientX - lastPosition.current.x;
          vpt[5] += e.clientY - lastPosition.current.y;

          //clampPan(canvas);

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
        if (isPanning.current) return;
        const delta = event.e.deltaY;
        let zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        zoom = Math.min(Math.max(zoom, 0.06), 20);
        const point = new fabric.Point(event.e.offsetX, event.e.offsetY);

        canvas.zoomToPoint(point, zoom);

        //clampPan(canvas);

        event.e.preventDefault();
        event.e.stopPropagation();
      });
    };

    const drawPixel = (canvas: fabric.Canvas, event: fabric.TPointerEvent) => {
      const pointer = canvas.getPointer(event);
      const x = Math.floor(pointer.x / PIXEL_SIZE) * PIXEL_SIZE;
      const y = Math.floor(pointer.y / PIXEL_SIZE) * PIXEL_SIZE;

      if (x < 0 || x > BOARD_WIDTH * PIXEL_SIZE || isNaN(x)) return;
      if (y < 0 || y > BOARD_HEIGHT * PIXEL_SIZE || isNaN(y)) return;
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

      smoothCenterTo(canvas, x, y);

      // pixels.current[xPixel][yPixel] = "#000";
      onChange?.({ x: row, y: col, color: colorRef.current || "#000" });
    };

    const smoothCenterTo = (
      canvas: fabric.Canvas,
      targetX: number,
      targetY: number,
      duration = 400 // ms
    ) => {
      isPanning.current = true;
      const start = performance.now();
      const vpt = canvas.viewportTransform!;
      const startPan = { x: vpt[4], y: vpt[5] };

      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();

      // Calcula el pan objetivo para centrar el punto
      const targetPan = {
        x: -targetX * canvas.getZoom() + canvasWidth / 2,
        y: -targetY * canvas.getZoom() + canvasHeight / 2,
      };

      const animate = (time: number) => {
        const t = Math.min((time - start) / duration, 1);
        const ease = t * (2 - t); // easing suave
        const x = startPan.x + (targetPan.x - startPan.x) * ease;
        const y = startPan.y + (targetPan.y - startPan.y) * ease;

        canvas.viewportTransform![4] = x;
        canvas.viewportTransform![5] = y;
        canvas.requestRenderAll();

        if (t < 1) requestAnimationFrame(animate);

        setTimeout(() => {
          isPanning.current = false;
        }, duration + 100);
      };

      requestAnimationFrame(animate);
    };

    // const clampPan = (canvas: fabric.Canvas) => {
    //   const vpt = canvas.viewportTransform!;
    //   const zoom = canvas.getZoom();

    //   // Canvas logical size in screen pixels
    //   const boardWidth = BOARD_WIDTH * PIXEL_SIZE * zoom;
    //   const boardHeight = BOARD_HEIGHT * PIXEL_SIZE * zoom;

    //   const canvasWidth = window.innerWidth;
    //   const canvasHeight = window.innerHeight;

    //   // Define how far outside the board the user can pan (2x board size)
    //   const maxOutsideX = boardWidth * 2;
    //   const maxOutsideY = boardHeight * 2;

    //   // Compute clamping limits
    //   const minX = -maxOutsideX;
    //   const maxX = boardWidth - canvasWidth + maxOutsideX;

    //   const minY = -maxOutsideY;
    //   const maxY = boardHeight - canvasHeight + maxOutsideY;

    //   // Clamp viewport translation
    //   vpt[4] = Math.max(minX, Math.min(vpt[4], maxX));
    //   vpt[5] = Math.max(minY, Math.min(vpt[5], maxY));

    //   canvas.setViewportTransform(vpt);
    // };

    const setUpCanvasBackground = (canvas: fabric.Canvas) => {
      canvas.selection = false;
      canvas.backgroundColor = "#333333";

      // Medidas totales del tablero (en píxeles reales)
      const boardPixelWidth = BOARD_WIDTH * PIXEL_SIZE;
      const boardPixelHeight = BOARD_HEIGHT * PIXEL_SIZE;

      // Rect blanco (el "board" donde se dibuja)
      const board = new fabric.Rect({
        left: 0, // Centrado horizontal
        top: 0, // Centrado vertical
        width: boardPixelWidth,
        height: boardPixelHeight,
        fill: "#ffffff", // Fondo blanco del tablero
        strokeWidth: 0,
        selectable: false,
        evented: false,
      });
      canvas.add(board);

      // canvas.sendObjectBackwards(board);
    };

    useEffect(() => {
      if (!canvasEl.current) return;
      const canvas = new fabric.Canvas(canvasEl.current, {
        selection: false,
        backgroundColor: "#333333",
      });

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

        setUpCanvasBackground(canvas);

        canvas.requestRenderAll();

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
