import MainLayout from "./layout/MainLayout.jsx";
import Gryffindor from "./pages/Gryffindor.jsx";
import Home from "./pages/Home.jsx";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="Gryffindor" element={<Gryffindor />} />
        </Route>
      </Routes>
    </>
  );
}
export default App;
