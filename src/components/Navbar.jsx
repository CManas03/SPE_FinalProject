// Navbar.jsx
import { Link } from 'react-scroll';
import "./Navbar.css"

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="home" smooth={true}>HOME</Link>
        </li>
        <li>
          <Link to="aboutme" smooth={true}>ME</Link>
        </li>
        <li>
          <Link to="section2" smooth={true}>PROJECTS</Link>
        </li>
        <li>
          <Link to="section3" smooth={true}>BLOG</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;