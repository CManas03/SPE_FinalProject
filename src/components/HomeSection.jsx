// HomeSection.jsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { fadeIn } from 'react-animations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import './Section.css';

const fadeInAnimation = keyframes`${fadeIn}`;

const AnimatedDiv = styled.div`
  animation: 5s ${fadeInAnimation};
  animation-fill-mode: forwards;
  opacity: 0;
`;

const AnimatedDiv1 = styled.div`
  animation: 10s ${fadeInAnimation};
  animation-fill-mode: forwards;
  opacity: 0;
`;

const HomeSection = () => {
  return (
    <div id="home" className="section bg-image">
      <div className="overlay">
        <div className="intro">
          <div className="text-container">
            <div className="greeting-container">
              <AnimatedDiv className="greeting" style={{animationDelay: '0s'}}>
                <h1>Chaitanya</h1>
              </AnimatedDiv>
              <AnimatedDiv className="greeting" style={{animationDelay: '0.5s'}}>
                <h1>&nbsp; &nbsp; Manas</h1>
              </AnimatedDiv>
            </div>
            <br />
            <br />
            <div className="description-container">
              <AnimatedDiv className="description" style={{animationDelay: '1s'}}>
                <p>Full Stack Developer</p>
              </AnimatedDiv>
              <AnimatedDiv className="description" style={{animationDelay: '1.5s'}}>
                <p>Sports Enthusiast</p>
              </AnimatedDiv>
              <AnimatedDiv className="description" style={{animationDelay: '2s'}}>
                <p>Music Afficionado</p>
              </AnimatedDiv>
            </div>
          </div>
        </div>
        <div className="scroll-down">
        <AnimatedDiv1 className="greeting" style={{animationDelay: '1.5s'}}>
          <div className="social-media">
                  <a href="https://www.linkedin.com/in/chaitanya-manas-cheedella-161596205/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faLinkedin} className="icon" /> 
                  </a>
                  <br />
                  <a href="https://github.com/CManas03" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faGithub} className="icon" />
                  </a>
                  <br />
                  <a href="https://www.instagram.com/cmanas03/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faInstagram} className="icon" />
                  </a>       
            </div>
          </AnimatedDiv1>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;