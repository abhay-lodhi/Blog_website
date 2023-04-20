import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { userContext } from "../userContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState("");
  const { setUserInfo } = useContext(userContext);
  const [redirect2, setRedirect2] = useState("");

  async function login(ev) {
    ev.preventDefault();

    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert("wrong credentials");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }
  if (redirect2) {
    return <Navigate to={"/register"} />;
  }

  function toRegister() {
    setRedirect2(true);
  }

  return (
    <div className="container">
      <form className="login" onSubmit={login}>
        <h1 className="log_req">Login</h1>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />

        <button className="btn_log_reg" type="submit">Login</button>

        <div className="signinText">
          <p className="log_req">Don't have a account?</p>
          <button className="signin" type="button" onClick={toRegister}>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
