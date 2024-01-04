import { api } from "../common/axios.ts";
import { useUserLogin } from "../store/useUserLogin.ts";
import { useIsAuthenticated } from "../store/useIsAuthenticated.ts";

export const useAuth = () => {
  const { userLogin, setUserLogin } = useUserLogin();
  const { isAuthenticated, setIsAuthenticated } = useIsAuthenticated();

  // axios
  const login = async (login: string, password: string) => {
    const { data } = await api.post<{ token: string; login: string }>(
      `/users/login`,
      {
        login,
        password,
      },
    );
    localStorage.setItem("token", data.token);
    localStorage.setItem("login", login);
    setUserLogin(login);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("login");
    setIsAuthenticated(false);
    setUserLogin(null);
  };

  const register = async (login: string, password: string) => {
    const { data } = await api.post<{ token: string }>(`/users`, {
      login,
      password,
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("login", login);
    setIsAuthenticated(true);
    setUserLogin(login);
  };

  return {
    isAuthenticated,
    userLogin,
    login,
    logout,
    register,
  };
};
