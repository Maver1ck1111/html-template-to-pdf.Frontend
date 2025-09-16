import { Outlet } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import "./App.css";

function App() {
  return (
    <>
      <NavBar />
      <div className="children">
        <Outlet />
      </div>
    </>
  );
}

export default App;
