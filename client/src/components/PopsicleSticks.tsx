import React, { useState } from 'react';
import './style.css'; 


interface PopsicleStickButtonProps {
  title: string;
  children: React.ReactNode;
  allowAdd?: boolean;
  saveHandler?: () => void;
  allowRemove?: boolean;
  removeHandler?: () => void;
}

const PopsicleStickButton: React.FC<PopsicleStickButtonProps> = ({ title, children, allowAdd, saveHandler, allowRemove, removeHandler }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown-container">
      <span className="homepage-buttons" onClick={toggleDropdown}>
        {title}
        {allowAdd && <button className="add-button" onClick={saveHandler}>+</button>}
        {allowRemove && <button className="remove-button" onClick={removeHandler}>-</button>}
      </span>
      <div className={`dropdown-card ${isOpen ? 'open' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default PopsicleStickButton;
