import { useState } from 'react';
import './style.css';

const DropdownCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCard = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown-container">
      <button onClick={toggleCard} className="dropdown-button">
        {isOpen ? 'Hide Info' : 'Show Info'}
      </button>

      <div className={`dropdown-card ${isOpen ? 'open' : ''}`}>
      </div>
    </div>
  );
};

export default DropdownCard;
