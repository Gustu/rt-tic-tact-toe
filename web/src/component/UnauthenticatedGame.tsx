import { useAuth } from "../hooks/useAuth.ts";
import { useState } from "react";
import toast from "react-hot-toast";

export const UnauthenticatedGame = () => {
  const { login, register } = useAuth();
  const [userLogin, setUserLogin] = useState("");
  const [userPassword, setUserPassword] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <input
          className="rounded p-3"
          placeholder="Login"
          type="text"
          value={userLogin}
          onChange={(e) => setUserLogin(e.target.value)}
        />
        <input
          className="rounded p-3"
          placeholder="Password"
          type="password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() =>
            login(userLogin, userPassword).catch((e) => {
              const responseMessage = e.response?.data?.message;
              toast.error(responseMessage ?? e.message);
            })
          }
        >
          Login
        </button>
        <button
          onClick={() =>
            register(userLogin, userPassword).catch((e) => {
              const responseMessage = e.response?.data?.message;
              toast.error(responseMessage ?? e.message);
            })
          }
        >
          Register
        </button>
      </div>
    </div>
  );
};
