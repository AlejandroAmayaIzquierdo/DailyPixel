import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

interface DrawingPanelProps {
  width?: number;
  height?: number;
  onChange?: (pixels: string[][]) => void;
}

export interface DrawingPanelRef {
  getPixels: () => string[][];
  setPixels?: (pixels: string[][]) => void;
  setPixelsFlat?: (pixels: string[]) => void;
}

const DrawingPanel = forwardRef<DrawingPanelRef, DrawingPanelProps>(
  ({ onChange }, ref) => {
    const localRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [pixelSize] = useState(20); // size of each pixel in px
    const [rows, cols] = [16, 16]; // grid size
    const [color, setColor] = useState("#000");

    const [pixels, setPixels] = useState<string[][]>(
      Array.from({ length: rows }, () => Array(cols).fill("#fff"))
    );

    useEffect(() => {
      const canvas = localRef.current;
      if (!canvas) return;
      canvas.width = cols * pixelSize;
      canvas.height = rows * pixelSize;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingEnabled = false; // keep it pixelated
    }, [pixelSize, rows, cols]);

    useImperativeHandle(ref, () => ({
      getPixels: () => pixels,
      setPixels: (newPixels: string[][]) => setPixels(newPixels),
      setPixelsFlat: (flatPixels: string[]) => {
        if (flatPixels.length !== rows * cols) {
          throw new Error("Invalid pixel array length");
        }
        const newPixels2D: string[][] = [];
        for (let r = 0; r < rows; r++) {
          newPixels2D.push(flatPixels.slice(r * cols, (r + 1) * cols));
        }
        drawPixels(newPixels2D);
      },
    }));

    const drawPixel = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!localRef.current) return;
      const canvas = localRef.current;
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext("2d");

      const x = Math.floor((e.clientX - rect.left) / pixelSize);
      const y = Math.floor((e.clientY - rect.top) / pixelSize);
      if (!ctx) return;
      ctx.fillStyle = color;
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);

      const copy = pixels.map((row) => [...row]);
      copy[y][x] = color;
      onChange?.(copy);
      setPixels(copy);
    };

    const drawPixels = (pixelsToDraw: string[][]) => {
      if (!localRef.current) return;
      const canvas = localRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.fillStyle = pixelsToDraw[r][c];
          ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
        }
      }
    };

    return (
      <div className="flex flex-col items-center">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="mb-2"
        />
        <canvas
          ref={localRef}
          onMouseDown={(e) => {
            setIsDrawing(true);
            drawPixel(e);
          }}
          onMouseMove={(e) => isDrawing && drawPixel(e)}
          onMouseUp={() => setIsDrawing(false)}
          onMouseLeave={() => setIsDrawing(false)}
          className="border border-gray-500"
        />
      </div>
    );
  }
);

export default DrawingPanel;
