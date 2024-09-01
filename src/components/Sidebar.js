import React, { useState, useEffect } from "react";
import Icon from "./Icon";

export default function Sidebar({
  addHistory,
  setCatPosition,
  catPosition,
  performActions,
  setRotationStyle,
  bounceIfOnEdge,
}) {
  const [inputX, setInputX] = useState(catPosition.x);
  const [inputY, setInputY] = useState(catPosition.y);
  const [duration, setDuration] = useState(1); 
  const [rotationStyle, setRotationStyleState] = useState("left-right");

  
  useEffect(() => {
    setInputX(catPosition.x);
    setInputY(catPosition.y);
  }, [catPosition]);

  
  const logAndAddHistory = (message) => {
    console.log(message);
    if (addHistory) addHistory(message);
  };

  const moveCat = (steps) => {
    setCatPosition((prev) => {
      const newX = prev.x + steps * Math.cos((prev.rotation * Math.PI) / 180);
      const newY = prev.y + steps * Math.sin((prev.rotation * Math.PI) / 180);
      const newPosition = { ...prev, x: newX, y: newY };
      logAndAddHistory(`Move ${steps} steps`);
      return newPosition;
    });
  };

  const rotateCat = (degrees) => {
    setCatPosition((prev) => {
      const newPosition = { ...prev, rotation: prev.rotation + degrees };
      logAndAddHistory(`Turn ${degrees} degrees`);
      return newPosition;
    });
  };

  const changeXBy = (value) => {
    setCatPosition((prev) => {
      const newPosition = { ...prev, x: prev.x + value };
      logAndAddHistory(`Change X by ${value}`);
      return newPosition;
    });
  };

  const setXTo = (value) => {
    setCatPosition((prev) => {
      const newPosition = { ...prev, x: value };
      logAndAddHistory(`Set X to ${value}`);
      return newPosition;
    });
  };

  const changeYBy = (value) => {
    setCatPosition((prev) => {
      const newPosition = { ...prev, y: prev.y + value };
      logAndAddHistory(`Change Y by ${value}`);
      return newPosition;
    });
  };

  const setYTo = (value) => {
    setCatPosition((prev) => {
      const newPosition = { ...prev, y: value };
      logAndAddHistory(`Set Y to ${value}`);
      return newPosition;
    });
  };

  const glide = (startX, startY, endX, endY, duration) => {
    console.log(
      `Gliding from (${startX}, ${startY}) to (${endX}, ${endY}) over ${duration} seconds`
    );
    const startTime = Date.now();
    const diffX = endX - startX;
    const diffY = endY - startY;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      setCatPosition((prev) => {
        const newPosition = {
          ...prev,
          x: startX + diffX * progress,
          y: startY + diffY * progress,
        };
        if (progress === 1) {
          logAndAddHistory(`Glide to position (${endX}, ${endY})`);
        }
        return newPosition;
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const goToRandomPosition = () => {
    const randomX = Math.floor(Math.random() * 200) - 100;
    const randomY = Math.floor(Math.random() * 200) - 100;

    setCatPosition((prev) => {
      const newPosition = { ...prev, x: randomX, y: randomY };
      logAndAddHistory(`Go to random position (${randomX}, ${randomY})`);
      return newPosition;
    });
  };

  const goToPosition = () => {
    setCatPosition((prev) => {
      const newPosition = { ...prev, x: inputX, y: inputY };
      logAndAddHistory(`Go to position (${inputX}, ${inputY})`);
      return newPosition;
    });
  };

  const glideToRandomPosition = () => {
    const randomX = Math.floor(Math.random() * 200) - 100;
    const randomY = Math.floor(Math.random() * 200) - 100;

    glide(catPosition.x, catPosition.y, randomX, randomY, duration);
  };

  const glideToPosition = () => {
    glide(catPosition.x, catPosition.y, inputX, inputY, duration);
  };

  const handleReplay = () => {
    if (performActions) performActions();
  };

  const handleBounceOnEdge = () => {
    if (bounceIfOnEdge) bounceIfOnEdge();
    logAndAddHistory("If on edge, bounce");
  };

  const handleSetRotationStyle = (style) => {
    setRotationStyleState(style);
    if (setRotationStyle) setRotationStyle(style);
    logAndAddHistory(`Set rotation style to ${style}`);
  };

  const rotationClass =
    rotationStyle === "left-right"
      ? "transform scale-x-[-1]"
      : rotationStyle === "all-around"
      ? "animate-spin"
      : "";

  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200 text-xs">
      <div className="font-bold">Events</div>
      <div className="flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 items-center cursor-pointer">
        When <Icon name="flag" size={15} className="text-green-600 mx-1" />{" "}
        clicked
      </div>
      <div className="flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 items-center cursor-pointer">
        When this sprite clicked
      </div>
      <button
        onClick={handleReplay}
        className="mt-4 bg-green-500 text-white px-3 py-1 text-xs rounded"
      >
        Replay Actions
      </button>
      <div className="font-bold">Motion</div>
      <div
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 items-center cursor-pointer"
        onClick={() => moveCat(10)}
      >
        Move 10 steps
      </div>
      <div
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 items-center cursor-pointer"
        onClick={() => rotateCat(-15)}
      >
        Turn <Icon name="undo" size={12} className="text-white mx-1" /> 15
        degrees
      </div>
      <div
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 cursor-pointer"
        onClick={() => rotateCat(15)}
      >
        Turn <Icon name="redo" size={12} className="text-white mx-1" /> 15
        degrees
      </div>
      {/* Go to Random Position Block */}
      <div
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 cursor-pointer"
        onClick={goToRandomPosition}
      >
        Go to Random Position
      </div>
      {/* Go to Specific Position Block */}
      <div className="flex items-center bg-blue-500 text-white px-2 py-1 my-2 cursor-pointer">
        <span onClick={goToPosition} className="flex-none">
          Go to position X:
        </span>
        <input
          type="number"
          value={inputX}
          onChange={(e) => setInputX(Number(e.target.value))}
          className="w-10 px-1 py-1 mx-1 bg-white text-black rounded flex-none"
        />
        <span className="flex-none">Y:</span>
        <input
          type="number"
          value={inputY}
          onChange={(e) => setInputY(Number(e.target.value))}
          className="w-10 px-1 py-1 mx-1 bg-white text-black rounded flex-none"
        />
      </div>
      {/* Glide to Random Position Block */}
      <div className="flex items-center bg-blue-500 text-white px-2 py-1 my-2 cursor-pointer">
        <span onClick={glideToRandomPosition} className="flex-none">
          Glide for
        </span>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-8 px-1 py-1 mx-1 bg-white text-black rounded flex-none"
        />
        <span className="flex-none">seconds to random position</span>
      </div>
      {/* Glide to Specific Position Block */}
      <div className="flex items-center bg-blue-500 text-white px-2 py-1 my-2 cursor-pointer">
        <span onClick={glideToPosition} className="flex-none">
          Glide
        </span>
        <span className="flex-none">&nbsp;sec:</span>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-10 px-1 py-1 mx-1 bg-white text-black rounded flex-none"
        />
        <span className="flex-none">x:</span>
        <input
          type="number"
          value={inputX}
          onChange={(e) => setInputX(Number(e.target.value))}
          className="w-10 px-1 py-1 mx-1 bg-white text-black rounded flex-none"
        />
        <span className="flex-none">Y:</span>
        <input
          type="number"
          value={inputY}
          onChange={(e) => setInputY(Number(e.target.value))}
          className="w-10 px-1 py-1 mx-1 bg-white text-black rounded flex-none"
        />
      </div>
      {/* Change X by Value Block */}
      <div className="flex items-center bg-blue-500 text-white px-2 py-1 my-2 cursor-pointer">
        <span onClick={() => changeXBy(inputX)} className="flex-none">
          Change X by
        </span>
        <input
          type="number"
          value={inputX}
          onChange={(e) => setInputX(Number(e.target.value))}
          className="w-12 px-1 py-1 mx-1 bg-white text-black rounded flex-none"
        />
      </div>
      {/* Set X to Value Block */}
      <div className="flex items-center bg-blue-500 text-white px-2 py-1 my-2 cursor-pointer">
        <span onClick={() => setXTo(inputX)} className="flex-none">
          Set X to
        </span>
        <input
          type="number"
          value={inputX}
          onChange={(e) => setInputX(Number(e.target.value))}
          className="w-12 px-1 py-1 mx-1 bg-white text-black rounded flex-none"
        />
      </div>
      {/* Change Y by Value Block */}
      <div className="flex items-center bg-blue-500 text-white px-2 py-1 my-2 cursor-pointer">
        <span onClick={() => changeYBy(inputY)} className="flex-none">
          Change Y by
        </span>
        <input
          type="number"
          value={inputY}
          onChange={(e) => setInputY(Number(e.target.value))}
          className="w-12 px-1 py-1 mx-1 bg-white text-black rounded flex-none"
        />
      </div>
      {/* Set Y to Value Block */}
      <div className="flex items-center bg-blue-500 text-white px-2 py-1 my-2 cursor-pointer">
        <span onClick={() => setYTo(inputY)} className="flex-none">
          Set Y to
        </span>
        <input
          type="number"
          value={inputY}
          onChange={(e) => setInputY(Number(e.target.value))}
          className="w-12 px-1 py-1 mx-1 bg-white text-black rounded flex-none"
        />
      </div>
      {/* If on edge, bounce Block */}
      <div
        className="flex items-center bg-blue-500 text-white px-2 py-1 my-2 cursor-pointer"
        onClick={handleBounceOnEdge}
      >
        If on edge, bounce
      </div>
      {/* Set Rotation Style Block */}
      <div className="flex items-center bg-blue-500 text-white px-2 py-1 my-2 cursor-pointer">
        <label className="mr-2">Rotation Style:</label>
        <select
          value={rotationStyle}
          onChange={(e) => handleSetRotationStyle(e.target.value)}
          className="bg-white text-black px-2 py-1 rounded"
        >
          <option value="left-right">Left-right</option>
          <option value="all-around">All-around</option>
          <option value="don't rotate">Don't rotate</option>
        </select>
      </div>
      <div className="font-bold">Looks</div>
      {/* Say for Seconds Block */}
      <div className="flex items-center bg-purple-500 text-white px-2 py-1 my-2 cursor-pointer">
        <span className="flex-none">Say</span>
        <input
          type="text"
          className="w-20 px-1 py-1 mx-1 bg-white text-black rounded flex-none"
          placeholder="Hello!"
        />
        <span className="flex-none">for</span>
        <input
          type="number"
          className="w-12 px-1 py-1 mx-1 bg-white text-black rounded flex-none"
          placeholder="2"
        />
        <span className="flex-none">sec</span>
      </div>
      {/* Say Block */}
      <div className="flex items-center bg-purple-500 text-white px-2 py-1 my-2 cursor-pointer">
        <span className="flex-none">Say</span>
        <input
          type="text"
          className="w-20 px-1 py-1 mx-1 bg-white text-black rounded flex-none"
          placeholder="Hello!"
        />
      </div>
      {/* Think for Seconds Block */}
      <div className="flex items-center bg-purple-500 text-white px-2 py-1 my-2 cursor-pointer">
        <span className="flex-none">Think</span>
        <input
          type="text"
          className="w-20 px-1 py-1 mx-1 bg-white text-black rounded flex-none"
          placeholder="Hmm..."
        />
        <span className="flex-none">for</span>
        <input
          type="number"
          className="w-12 px-1 py-1 mx-1 bg-white text-black rounded flex-none"
          placeholder="2"
        />
        <span className="flex-none">sec</span>
      </div>
      {/* Think Block */}
      <div className="flex items-center bg-purple-500 text-white px-2 py-1 my-2 cursor-pointer">
        <span className="flex-none">Think</span>
        <input
          type="text"
          className="w-20 px-1 py-1 mx-1 bg-white text-black rounded flex-none"
          placeholder="Hmm..."
        />
      </div>
      {/* Switch Costume Block */}
      <div className="flex items-center bg-purple-500 text-white px-2 py-1 my-2 cursor-pointer">
        <span className="flex-none">Switch costume to</span>
        <select className="bg-white text-black px-2 py-1 mx-1 rounded flex-none">
          <option value="costume1">Costume 1</option>
          <option value="costume2">Costume 2</option>
        </select>
      </div>
      {/* Switch Backdrop (Next) Block */}
      <div className="flex items-center bg-purple-500 text-white px-2 py-1 my-2 cursor-pointer">
        <span className="flex-none">Switch Costume</span>
      </div>
      {/* Switch Backdrop Block */}
      <div className="flex items-center bg-purple-500 text-white px-2 py-1 my-2 cursor-pointer">
        <span className="flex-none">Switch backdrop</span>
        <select className="bg-white text-black px-2 py-1 mx-1 rounded flex-none">
          <option value="backdrop1">Backdrop 1</option>
          <option value="nextBackdrop">Next Backdrop</option>
          <option value="previousBackdrop">Previous Backdrop</option>
          <option value="randomBackdrop">Random Backdrop</option>
        </select>
      </div>
      {/* Switch Backdrop (Next) Block */}
      <div className="flex items-center bg-purple-500 text-white px-2 py-1 my-2 cursor-pointer">
        <span className="flex-none">Switch backdrop</span>
      </div>
    </div>
  );
}
