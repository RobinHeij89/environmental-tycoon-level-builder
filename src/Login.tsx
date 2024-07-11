import MD5 from "crypto-js/md5";
import { useState } from "react";

import App from "./App";

export const Login = () => {
  const [isVerified, setIsVerified] = useState(false);

  const checkPw = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const answer = (document.getElementById("password") as HTMLInputElement).value;
    if (MD5(answer).toString() === "7ac0fbbd5aa7d2c98e3328c864df28b7") {
      setIsVerified(true);
    }
  };

  return (
    <>
      {isVerified ? <App />
        : (
          <form onSubmit={checkPw}>
            <input id="password" name="password" type='password' />
            <button>Enter the website</button>
          </form>
        )
      }
    </>
  )
};