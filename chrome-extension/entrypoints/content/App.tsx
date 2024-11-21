import { Button } from "../components/ui/button";
import { CommandModal } from "../components/ui/command-modal";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default () => {
  const [count, setCount] = useState(1);
  const increment = () => setCount((count) => count + 1);

  const [selectedText, setSelectedText] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      setSelectedText(window.getSelection()?.toString() || "");
    };

    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  useEffect(() => {
    if (selectedText) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setButtonPosition({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
          });
          setShowButton(true);
        }
      }, 700);
    } else {
      setShowButton(false);
    }
  }, [selectedText]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedText) {
        if (event.metaKey && event.key === 'k') {
          setShowModal(true);
        } else if (event.key === 'Escape') {
          setShowModal(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedText]);

  const handleButtonClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  console.log("Show modal", showModal);
  console.log(selectedText);

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
      )}
      {showModal && (
        <CommandModal/>
      )} */}
      <CommandModal/>
      <Button>Click Me</Button>
    </div>
  );
};
