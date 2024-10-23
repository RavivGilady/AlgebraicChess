import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './MoveInput.css';

const MoveInput = ({ onSubmit }) => {
  const [move, setMove] = useState('');
  const [active, setActive] = useState(true);
  const handleChange = (event) => {
    setMove(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission or other default behavior
      if (move.trim()) {
        onSubmit(move);
        console.log(move)
        setMove(''); 
        setActive(false)    
      }
    }
  };
  return (
    <input
      type="text"
      value={move}
      onChange={handleChange}
      onKeyDown={handleKeyDown} // Add the keydown event listener
          required
      className={active ? 'active' : ''}

    />
  );
};

MoveInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default MoveInput;