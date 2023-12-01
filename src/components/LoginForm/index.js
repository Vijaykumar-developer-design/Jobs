import { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const history = useHistory();

  const onSuccess = (jwtToken) => {
    Cookies.set("jwt_token", jwtToken, { expires: 30 });
    history.replace("/");
  };

  const submitForm = async (event) => {
    event.preventDefault();
    const userDetails = { username, password };
    const url = "https://apis.ccbp.in/login";
    const options = {
      method: "POST",
      body: JSON.stringify(userDetails),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok) {
        const jwtToken = data.jwt_token;
        onSuccess(jwtToken);
        setUsername("");
        setPassword("");
      } else {
        setShowErrorMsg(true);
        setErrorMsg(data.error_msg);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const getUsername = (event) => setUsername(event.target.value);

  const getPassword = (event) => setPassword(event.target.value);

  const renderUserForm = () => (
    <form onSubmit={submitForm} className="form-background">
      <img
        className="image"
        src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
        alt="website logo"
      />
      <div className="inputs">
        <label className="name-text" htmlFor="name">
          USERNAME
        </label>
        <input
          placeholder="Username"
          onChange={getUsername}
          type="text"
          className="username"
          id="name"
        />
      </div>
      <div className="inputs">
        <label className="name-text" htmlFor="passwd">
          PASSWORD
        </label>
        <input
          placeholder="Password"
          onChange={getPassword}
          type="password"
          className="password"
          id="passwd"
        />
      </div>
      <button className="submit-btn" type="submit">
        Login
      </button>
      {showErrorMsg && <p className="error-message">*{errorMsg}</p>}
    </form>
  );

  const jwtToken = Cookies.get("jwt_token");
  console.log(jwtToken);
  if (jwtToken !== undefined) {
    return <Redirect to="/" />;
  }

  return <div className="login-background">{renderUserForm()}</div>;
};

export default LoginForm;
