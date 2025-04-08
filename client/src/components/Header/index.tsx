import { Link } from 'react-router-dom';
import { type MouseEvent} from 'react';
import Auth from '../../utils/auth';
import '../style.css';
import '../../App.css';

const Header = () => {
  const logout = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    Auth.logout();
  };
  return (
    <header>
      <div className="container header-container">
       
        <div>
        <Link to="/" className="site-title-link">
          <h1>Veggie Vault</h1>
          </Link>
        </div>
        <div>
          {Auth.loggedIn() ? (
            <>
              <Link className="header-buttons" to="/myseedbox">
                {Auth.getProfile().data.username}'s Seed Box
              </Link>
              <button className="header-buttons" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <div className="header-buttons-container">
              <Link className="header-buttons" to="/login">
                Login
              </Link>
              <Link className="header-buttons" to="/signup">
                Signup
              </Link>
              <Link className="header-buttons" to="/myseedbox">
                My Seed Box
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
