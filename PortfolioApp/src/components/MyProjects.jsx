import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useSpring, animated } from 'react-spring';
import './MyProjects.css';

Modal.setAppElement('#root');


const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const animation = useSpring({
    opacity: modalIsOpen ? 1 : 0,
    transform: modalIsOpen ? `translateY(0)` : `translateY(-200%)`,
    config: { duration: 200 },
  });

  useEffect(() => {
    fetch('http://localhost:8000/items/')
      .then(response => response.json())
      .then(data => setProjects(data.items)); // Extract items from data
  }, []);

  const openModal = (project) => {
    setSelectedProject(project);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  let startX, scrollLeft;

  const startDrag = (e) => {
    e.preventDefault();
    const innerContainer = e.currentTarget;
    startX = e.pageX - innerContainer.offsetLeft;
    scrollLeft = innerContainer.scrollLeft;
  };
  
  const drag = (e) => {
    if (e.buttons === 0) return; // Only drag when mouse button is pressed
    e.preventDefault();
    const innerContainer = e.currentTarget;
    const x = e.pageX - innerContainer.offsetLeft;
    const walk = (x - startX);
    innerContainer.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="projects-container" id="myprojects">
      <div className="projects-inner-container" onMouseDown={startDrag} onMouseLeave={drag} onMouseUp={drag} onMouseMove={drag}>
        {projects.map(project => (
          <div key={project.id} className="project-item" onClick={() => openModal(project)}>
            <h2>{project.title}</h2>
            <br/>
            <p>{project.tldr}</p>
          </div>
        ))}
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal-content">
        <animated.div style={animation}>
          {selectedProject && (
            <>
              <h2>{selectedProject.title}</h2>
              <br/>
              <p>About : {selectedProject.description}</p>
              <br/>
              <p>Tech Stack : {selectedProject.techstack}</p>
              <p>URL :  <a href={selectedProject.url} target="_blank" rel="noopener noreferrer">
                  {selectedProject.url}
                </a>
              </p>
            </>
          )}
        </animated.div>
      </Modal>
    </div>
  );
};

export default MyProjects;