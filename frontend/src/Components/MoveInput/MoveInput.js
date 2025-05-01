// /src/components/MoveInput.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext'

const MoveInput = () => {
    const { sendMoveToServer, gameState } = useGame()
    const [input, setInput] = useState('');
    const [isCursorVisible, setCursorVisible] = useState(true);
    const inputRef = useRef(null);


    const handleKeyDown = (e) => {
        let key = e.key
        if (key === 'Enter' && input.trim()) {
            sendMoveToServer(input.trim());
            setInput('');
            return;
          } 
          if (key === 'Backspace') {
            e.preventDefault();
            setInput((prev) => prev.slice(0, -1));
            return;
          }
      
          if (key === 'Delete') {
            e.preventDefault();
            setInput(''); // You could implement cursor-based delete, but this is simpler
            return;
          }

          const validKeyPattern = /^[a-zA-Z0-9+\-x=#]+$/;

          if (key.length === 1 && validKeyPattern.test(key)) {
            setInput((prev) => prev + key); // Append the typed character to the input
          }
    };
    useEffect(() => inputRef.current.focus() , []);

    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setCursorVisible((prev) => !prev); // Toggle cursor visibility
        }, 500); // 500ms for blink

        return () => clearInterval(cursorInterval); // Cleanup on unmount
    }, []);
    useEffect(() => {
        if (inputRef.current && inputRef.current.innerText !== input) {
          inputRef.current.innerText = input;
        }
      }, [input]);
    
    return (
        <div className="flex items-center justify-center h-full relative">
      <div
        ref={inputRef}
        onKeyDown={handleKeyDown}
        tabIndex="0"
        suppressContentEditableWarning
        className="text-[72pt] text-[#543A14] bg-transparent border-none outline-none text-center placeholder-[#543A1455] w-full max-w-[80%] caret-transparent flex overflow-hidden"
      >
      </div>
    </div>
    );
};

export default MoveInput;




