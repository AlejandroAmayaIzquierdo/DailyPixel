import { Route, Routes } from "react-router-dom";
import IndexPage from "./Pages/Index";

// interface AppProps {}
const App: React.FC = () => {
  return (
    <div className="flex flex-1 flex-col">
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
};

export default App;
