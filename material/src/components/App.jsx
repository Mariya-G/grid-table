import Remains from "./Remains";
import Header from "./Header";
import Login from "./Login";
import Cards from "./Cards";
import Sales from "./Sales";
import Reports from "./Reports";

import { Route, Routes } from "react-router-dom";
function App() {
  return (
    <div className="content">
      <Header />
      <Routes>
        <Route path="/" element={<Remains />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
