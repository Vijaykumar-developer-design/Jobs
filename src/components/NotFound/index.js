import { useHistory } from "react-router-dom";
import Header from "../Header";
import "./index.css";

const NotFound = () => {
  const history = useHistory();
  return (
    <div>
      <Header history={history} />
      <div className="not-bg">
        <img
          src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png "
          alt="not found"
        />
        <h1 className="not-head">Page Not Found</h1>
        <p className="not-head">
          we&apos;re sorry, the page you requested could not be found
        </p>
      </div>
    </div>
  );
};
export default NotFound;
