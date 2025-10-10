import { useState } from "react";

interface ColorPickerProps {
  onChange?: (color: string) => void;
}

const colors: string[] = [
  "#000000",
  "#696969",
  "#555555",
  "#808080",
  "#D3D3D3",
  "#FFFFFF",
  "#FF9999",
  "#CC3333",
  "#DC143C",
  "#990000",
  "#800000",
  "#CCFF8C",
  "#81DE76",
  "#006F3C",
  "#3A55B4",
  "#6CADDF",
  "#8CD9FF",
  "#00FFFF",
  "#B77DFF",
  "#BE45FF",
  "#FA3983",
  "#FF9900",
  "#FFE600",
  "#573400",
];
const ColorPicker: React.FC<ColorPickerProps> = ({ onChange }) => {
  const [selectedColor, setSelectedColor] = useState<string>("#000000");
  return (
    <div className="absolute bottom-5 w-[95%]">
      <div className="w-full h-fit rounded-md bg-gray-400/20 backdrop-blur-sm border-2 border-gray-200">
        <div className="flex flex-wrap gap-2 p-3 justify-center items-center">
          {colors.map((color) => (
            <div
              key={color}
              className={`w-10 h-10 rounded-sm cursor-pointer hover:scale-110 transition-transform duration-200 ${
                selectedColor === color ? "ring-2 ring-white" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => {
                setSelectedColor(color);
                if (onChange) onChange(color);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
