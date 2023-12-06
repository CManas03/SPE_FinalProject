import React from 'react';
import './AboutMe.css';

const AboutMe = () => {
  const aboutMeText = "In Bangalore's vibrant mosaic, I thrive amidst diverse cultures, fluent in four languages that foster connections. Movies, cricket, and tennis ignite spirited dialogues, reflecting my zest for interaction.\n\nCollege sparked my journey in software engineering, unveiling the world of hackathons and full-stack development. Eagerly embracing machine learning and adaptable tech stacks, I seek knowledge without bounds.\n\nGoing beyond expectations, I delve into business intricacies, aiming to redefine standards and add unparalleled value. Amidst Student Affairs, I honed leadership orchestrating my college fest, while clubs meld my interests into impactful experiences.";

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

