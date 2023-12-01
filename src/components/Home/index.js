import { Redirect, Link, useHistory } from "react-router-dom";

import Cookies from "js-cookie";
import Header from "../Header";
import "./index.css";

const Home = () => {
  const history = useHistory();

  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken === undefined) {
    return <Redirect to="/login" />;
  }
  return (
    <div className="home-bg">
      <Header history={history} />
      <div className="content">
        <h1 className="head">Find The Job That Fits Your Life</h1>
        <p className="para">
          Millions of people are searching for jobs,salary information,company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs">
          <button className="find-jobs" type="button">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  );
};
export default Home;
