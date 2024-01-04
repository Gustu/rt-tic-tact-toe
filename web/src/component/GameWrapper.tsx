import { useAuth } from "../hooks/useAuth.ts";
import { AuthenticatedGame } from "./AuthenticatedGame.tsx";
import { UnauthenticatedGame } from "./UnauthenticatedGame.tsx";

export const GameWrapper = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="App">
      {isAuthenticated ? <AuthenticatedGame /> : <UnauthenticatedGame />}
    </div>
  );
};
