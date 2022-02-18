import axios from "axios";
import React, { ChangeEvent, useState } from "react";

export const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const onChangeUserName = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };
  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // 新規登録
  const postRegisterUser = async (
    inputUserName: string,
    inputPassword: string
  ) => {
    try {
      const result = await axios.post("http://localhost:8000/users", {
        username: inputUserName,
        password_hash: inputPassword,
      });
      console.log(result.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <p>user name</p>
      <input type="text" onChange={onChangeUserName} value={userName} />
      <br />
      <p>password</p>
      <input type="password" onChange={onChangePassword} value={password} />
      <br />
      <button onClick={() => postRegisterUser(userName, password)}>
        新規登録
      </button>
    </>
  );
};
