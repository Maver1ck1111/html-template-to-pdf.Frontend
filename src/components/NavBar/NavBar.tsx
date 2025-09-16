import { useNavigate } from "react-router-dom";
import "./Navabar.css";

export default function NavBar() {
  const navigate = useNavigate();
  function handleClick() {
    navigate("/create");
  }
  return (
    <nav className="navbar">
      <div className="navbar-left">HTML &rarr; PDF</div>
      <div className="navbar-right">
        <button className="create-button" onClick={handleClick}>
          Create Template
        </button>
      </div>
    </nav>
  );
}
