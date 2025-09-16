import "./Navabar.css";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">HTML &rarr; PDF</div>
      <div className="navbar-right">
        <button className="create-button">Create Template</button>
      </div>
    </nav>
  );
}
