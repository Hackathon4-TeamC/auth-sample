import axios from "axios";
import React, { ChangeEvent, useContext, useState } from "react";
import { UserContext } from "../providers/UserProvider";

export const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useContext(UserContext);

  const onChangeUserName = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };
  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // ログイン パスワード認証をして、tokenが返却されてくる
  const postLoginUser = async (
    inputUserName: string,
    inputPassword: string
  ) => {
    try {
      const formData = new FormData();
      formData.append("username", inputUserName);
      formData.append("password", inputPassword);
      console.log(formData);
      const config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "content-type": "multipart/form-data",
        },
      };

      const result = await axios.post(
        "http://localhost:8000/token",
        formData,
        config
      );
      if (result.data.access_token) {
        setToken(result.data.access_token);
        localStorage.setItem("token", result.data.access_token);
      } else {
        console.log("パスワードかメールアドレスが違います");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ログアウト
  const onClickLogout = () => {
    setToken("");
    localStorage.clear();
  };

  return (
    <>
      <p>user name</p>
      <input type="text" onChange={onChangeUserName} value={userName} />
      <br />
      <p>password</p>
      <input type="password" onChange={onChangePassword} value={password} />
      <br />
      <button onClick={() => postLoginUser(userName, password)}>
        ログイン
      </button>
      <button onClick={onClickLogout}>ログアウト</button>
    </>
  );
};
