import React, { useState } from 'react';
import './style.css'; 


interface PopsicleStickButtonProps {
  title: string;
  children: React.ReactNode;
  allowAdd: boolean;
}

const PopsicleStickButton: React.FC<PopsicleStickButtonProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown-container">
      <button className="homepage-buttons" onClick={toggleDropdown}>
        {title}
      </button>
      <div className={`dropdown-card ${isOpen ? 'open' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default PopsicleStickButton;
