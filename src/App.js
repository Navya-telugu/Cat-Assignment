import React, { useState, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

export default function App() {
  const [history, setHistory] = useState([]);
  const [catPosition, setCatPosition] = useState({ x: 0, y: 0, rotation: 0 });
  const [message, setMessage] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [replayInterval, setReplayInterval] = useState(null);

  const addHistory = (action) => {
    setHistory((prevHistory) => [...prevHistory, action]);
  };

  const performActions = useCallback(() => {
    if (replayInterval) {
      clearInterval(replayInterval);
    }

    let currentStep = 0;
    const totalSteps = history.length;

    const executeStep = () => {
      if (currentStep >= totalSteps) {
        clearInterval(replayInterval);
        return;
      }

      const action = history[currentStep];
      const [command, ...rest] = action.split(" ");
      const value = rest.join(" ");

      switch (command) {
        case "Move":
          const steps = parseInt(value, 10);
          if (!isNaN(steps)) {
            setCatPosition((prev) => ({
              ...prev,
              x: prev.x + steps * Math.cos((prev.rotation * Math.PI) / 180),
              y: prev.y + steps * Math.sin((prev.rotation * Math.PI) / 180),
            }));
          }
          break;

        case "Turn":
          const degrees = parseInt(value, 10);
          if (!isNaN(degrees)) {
            setCatPosition((prev) => ({
              ...prev,
              rotation: prev.rotation + degrees,
            }));
          }
          break;

        case "Change":
          const [axis, amount] = value.split(" by ");
          const delta = parseInt(amount, 10);
          if (axis && !isNaN(delta)) {
            setCatPosition((prev) => ({
              ...prev,
              [axis.toLowerCase()]: prev[axis.toLowerCase()] + delta,
            }));
          }
          break;

        case "Set":
          const [setAxis, setValue] = value.split(" to ");
          const newValue = parseInt(setValue, 10);
          if (setAxis && !isNaN(newValue)) {
            setCatPosition((prev) => ({
              ...prev,
              [setAxis.toLowerCase()]: newValue,
            }));
          }
          break;

        case "Glide":
          const [startX, startY, endX, endY] = value
            .replace(/[()]/g, "")
            .split(",");
          const endPosX = parseInt(endX, 10);
          const endPosY = parseInt(endY, 10);
          if (!isNaN(endPosX) && !isNaN(endPosY)) {
            setCatPosition({ x: endPosX, y: endPosY, rotation: 0 });
          }
          break;

        case "Go":
          const [gotoX, gotoY] = value
            .replace("position (", "")
            .replace(")", "")
            .split(",");
          const posX = parseInt(gotoX, 10);
          const posY = parseInt(gotoY, 10);
          if (!isNaN(posX) && !isNaN(posY)) {
            setCatPosition({
              x: posX,
              y: posY,
              rotation: 0,
            });
          }
          break;

        default:
          break;
      }

      currentStep += 1;
    };

    const interval = setInterval(executeStep, 1000); // Adjust the delay as needed
    setReplayInterval(interval);
  }, [history, replayInterval]);

  const handleSetMessage = (msg) => {
    setMessage(msg);
    setTooltipVisible(true);
    setTimeout(() => setTooltipVisible(false), 3000); // Tooltip disappears after 3 seconds
  };

  return (
    <div className="bg-blue-100 pt-6 font-sans">
      <div className="h-screen overflow-hidden flex flex-row">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar
            addHistory={addHistory}
            setCatPosition={setCatPosition}
            catPosition={catPosition}
            performActions={performActions}
            setMessage={handleSetMessage}
          />
          <MidArea />
        </div>
        <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2 relative">
          <PreviewArea
            catPosition={catPosition}
            setCatPosition={setCatPosition}
            history={history}
            message={message}
            tooltipVisible={tooltipVisible}
          />
        </div>
      </div>
    </div>
  );
}
