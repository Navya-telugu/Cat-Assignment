import React from "react";
import Draggable from "react-draggable";
import CatSprite from "./CatSprite";

export default function PreviewArea({ catPosition, setCatPosition, tooltipVisible, message }) {
  const handleDrag = (e, data) => {
    setCatPosition((prevPosition) => ({
      ...prevPosition,
      x: data.x,
      y: data.y,
    }));
  };

  return (
    <div className="relative w-full h-full overflow-hidden p-2">
      <Draggable
        position={{ x: catPosition.x, y: catPosition.y }}
        onDrag={handleDrag}
      >
        <div
          style={{
            transform: `rotate(${catPosition.rotation}deg)`,
            transition: "transform 0.3s",
          }}
        >
          <CatSprite />
        </div>
      </Draggable>
      {tooltipVisible && (
        <div className="tooltip">
          {message}
        </div>
      )}
    </div>
  );
}
