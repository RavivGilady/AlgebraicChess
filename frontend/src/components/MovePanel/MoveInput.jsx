// /src/components/MoveInput.jsx
import React, { useState, useEffect, useRef } from "react";
import { useGame } from "../../context/GameContext";

const MoveInput = () => {
  const { sendMoveToServer } = useGame();
  const [move, setMove] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    // Allow only a-z, A-Z, 0-9, =, +, #
    const filtered = value.replace(/[^a-zA-Z0-9-=+#]/g, "");
    setMove(filtered);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && move.trim()) {
      sendMoveToServer(move.trim());
      setMove("");
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={move}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className="w-full text-[72pt] text-[#543A14] bg-transparent border-none outline-none text-center placeholder-[#543A14]/40"
      spellCheck={false}
      autoComplete="off"
      autoCapitalize="off"
      autoCorrect="off"
    />
  );
};

export default MoveInput;
