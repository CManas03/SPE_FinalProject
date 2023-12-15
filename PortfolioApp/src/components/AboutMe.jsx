import React from 'react';
import './AboutMe.css';

const AboutMe = () => {
  const aboutMeText = "In Bangalore's vibrant mosaic, I thrive amidst diverse cultures, fluent in four languages that foster connections. Movies, cricket, and tennis ignite spirited dialogues, reflecting my zest for interaction.\n\nCollege sparked my journey in software engineering, unveiling the world of hackathons and full-stack development. Eagerly embracing machine learning and adaptable tech stacks, I seek knowledge without bounds. My passion for learning and growth drives me to explore new avenues, from web development to data science.\n\nI am a firm believer in the power of technology to transform lives. I am excited to leverage my skills to create innovative solutions that make a difference.";

  return (
    <div id="aboutme" className="section aboutme-container">
      <div className="profile-pic"></div>
      <p className="aboutme-text">
        {aboutMeText.split('\n\n').map((paragraph, index) => (
          <React.Fragment key={index}>
            {paragraph}
            <br /><br />
          </React.Fragment>
        ))}
      </p>
    </div>
  );
};

export default AboutMe;

