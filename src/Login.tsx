import MD5 from "crypto-js/md5";
import { useState } from "react";
import 'primereact/resources/themes/bootstrap4-dark-purple/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css

import { Button } from 'primereact/button';
import App from "./App";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";

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
          <Card title="Login">
            <form onSubmit={checkPw}>
              <InputText id="password" name="password" type='password' />
              <Button>Enter the website</Button>
            </form>
          </Card>
        )
      }
    </>
  )
};