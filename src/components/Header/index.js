import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";

const Header = (props) => {
  const { history } = props;

  const onClickLogout = () => {
    Cookies.remove("jwt_token");
    history.replace("/login");
  };

  return (
    <nav className="nav-bar">
      <Link className="link" to="/">
        <img
          className="nav-img"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>

      <Link className="link" to="/">
        <li className="list-home">Home</li>
      </Link>
      <Link className="link" to="/jobs">
        <li className="list-home">Jobs</li>
      </Link>
      <li className="list-home">
        <button onClick={onClickLogout} className="log-out" type="button">
          Logout
        </button>
      </li>
    </nav>
  );
};
export default Header;
