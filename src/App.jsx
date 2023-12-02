// App.jsx
import React from 'react';
import Navbar from './components/Navbar.jsx';
import AboutMe from './components/AboutMe.jsx';
import HomeSection from './components/HomeSection.jsx';
import Section2 from './components/Section2.jsx';
import Section3 from './components/Section3.jsx';

function App() {
  return (
    <div>
      <Navbar />
        <HomeSection id="home" />
        <AboutMe id="aboutme" />
        <Section2 id="section2" />
        <Section3 id="section3" />
    </div>
  );
}

export default App;