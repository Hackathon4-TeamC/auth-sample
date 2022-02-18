import { useContext, useEffect } from "react";
import { UserContext } from "../providers/UserProvider";

export const IsLogin = () => {
  const { token, setToken } = useContext(UserContext);
  useEffect(() => {
    const storageToken = localStorage.getItem("token");
    if (storageToken) {
      setToken(storageToken);
    }
  });
  return token ? <p>ログイン中</p> : <p>ログアウト</p>;
};
