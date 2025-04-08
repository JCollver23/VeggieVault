import React from 'react';
import '../style.css';


const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div>
        <p className="footer-text">&copy; {currentYear} VeggieVault LLC. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;