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
          <Link to="myprojects" smooth={true}>PROJECTS</Link> 
        </li>
      </ul>
    </nav>
  );
};
export default Navbar;