import React, { useState } from 'react';
import './style.css'; 


interface PopsicleStickButtonProps {
  title: string;
  children: React.ReactNode;
  allowAdd?: boolean;
  saveHandler?: () => void;
}

const PopsicleStickButton: React.FC<PopsicleStickButtonProps> = ({ title, children, allowAdd, saveHandler }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown-container">
      <button className="homepage-buttons" onClick={toggleDropdown}>
        {title}
        {allowAdd && <button className="add-button" onClick={saveHandler}>+</button>}
      </button>
      <div className={`dropdown-card ${isOpen ? 'open' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default PopsicleStickButton;
