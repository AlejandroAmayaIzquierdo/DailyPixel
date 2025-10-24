import { useState } from "react";
import { Info } from "lucide-react";

// interface CheatSheetProps {}

const textPan = ["ALT", "+", "Click", "=", "Pan"];
const textDraw = ["Click", "=", "Draw"];
const textZoomIn = ["Scroll", "Up", "=", "Zoom In"];
const textZoomOut = ["Scroll", "Down", "=", "Zoom Out"];
const CheatSheet: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="absolute top-5 left-5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Info Icon */}
      <div className="rounded-full bg-gray-500/20 backdrop-blur-sm border-2 border-gray-200 p-2 text-white font-semibold hover:bg-gray-500/30 transition-all cursor-help max-w-11">
        <Info size={24} />
      </div>

      {/* Cheat Sheet Content - Appears on Hover */}
      {isHovered && (
        <div className="flex flex-col gap-2 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-row gap-2">
            {textZoomOut.map((item, index) => (
              <div
                key={index}
                className="rounded-md bg-gray-500/20 backdrop-blur-sm border-2 border-gray-200 p-1 px-2 text-white font-semibold"
              >
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-row gap-2">
            {textZoomIn.map((item, index) => (
              <div
                key={index}
                className="rounded-md bg-gray-500/20 backdrop-blur-sm border-2 border-gray-200 p-1 px-2 text-white font-semibold"
              >
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-row gap-2">
            {textPan.map((item, index) => (
              <div
                key={index}
                className="rounded-md bg-gray-500/20 backdrop-blur-sm border-2 border-gray-200 p-1 px-2 text-white font-semibold"
              >
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-row gap-2">
            {textDraw.map((item, index) => (
              <div
                key={index}
                className="rounded-md bg-gray-500/20 backdrop-blur-sm border-2 border-gray-200 p-1 px-2 text-white font-semibold"
              >
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheatSheet;
