import React, { useState } from "react";
import PropTypes from "prop-types";

const MoveInput = ({ onSubmit }) => {
  const [move, setMove] = useState("");
  const [active, setActive] = useState(true);
  const handleChange = (event) => {
    setMove(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission or other default behavior
      if (move.trim()) {
        onSubmit(move);
        console.log(move);
        setMove("");
        setActive(false);
      }
    }
  };
  return (
    <input
      type="text"
      value={move}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      required
      className={`w-full rounded-md border-2 border-accent bg-background p-2 text-move-input text-inputText outline-none transition focus:ring-2 focus:ring-accent ${
        active ? "opacity-100" : "opacity-50"
      }`}
    />
  );
};

MoveInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default MoveInput;
