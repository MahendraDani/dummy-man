import { Check, Clipboard } from "lucide-react";
import { useState } from "react";

export const CopyButton = ({ codeString }: { codeString: string }) => {
  const [showCopyButton, setShowCopytButton] = useState(true);
  return (
    <div className="p-1 px-2 rounded-tr-sm">
      {showCopyButton ? (
        <button
          onClick={() => {
            navigator.clipboard.writeText(codeString);
            setShowCopytButton(false);
            setTimeout(() => {
              setShowCopytButton(true);
            }, 1 * 1000);
          }}
        >
          {<Clipboard size={"14px"} />}
        </button>
      ) : (
        <button disabled>{<Check size={"14px"} />}</button>
      )}
    </div>
  );
};