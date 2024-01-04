import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import { GameWrapper } from "./component/GameWrapper.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameWrapper />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
