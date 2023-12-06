// App.jsx
import React from 'react';
import Navbar from './components/Navbar.jsx';
import AboutMe from './components/AboutMe.jsx';
import HomeSection from './components/HomeSection.jsx';
import MyProjects from './components/MyProjects.jsx'; 
import Section3 from './components/Section3.jsx';
function App() {
  return (
    <div>
      <Navbar />
        <HomeSection id="home" />
        <AboutMe id="aboutme" />
        <MyProjects id="myprojects" /> 
        <Section3 id="section3" />
    </div>
  );
}
export default App;