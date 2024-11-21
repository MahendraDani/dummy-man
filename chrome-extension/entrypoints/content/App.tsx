import { Button } from "../components/ui/button";
import { CommandModal } from "../components/ui/command-modal";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default () => {

  return (
    <div>
      {/* {showButton && (
        <button
          style={{
            position: "absolute",
            top: buttonPosition.top,
            left: buttonPosition.left,
          }}
          className="z-[10000] bg-red-400"
          onClick={handleButtonClick}
        >
          Show Selection
        </button>
      )} */}
      <CommandModal/>
    </div>
  );
};
