import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faBookOpen, faLaptopCode, faCog, faPaintBrush } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import './Index.css';
import { Card } from 'react-bootstrap';
const Index = () => {
    const welcomeText = "Welcome to NoteSharing";
  const letters = welcomeText.split('').map((letter, index) => (
    <span key={index} className="letter" style={{animationDelay: `${index * 0.1}s`}}>
      {letter}
    </span>
  ));
  return (
    <div>
      {/* NoteSharing Container */} 
      <div className="notesharing-container">
        <div className="text-center mb-4 hero-section">
        <div className="hero-content">
          <FontAwesomeIcon icon={faGraduationCap} size="8x" className="graduation-cap" />
          <div className="hero-text">
            <h1 className="animated-title">{letters}</h1>
            <p className="hero-description">
              Share and convert your notes, documents, and ideas effortlessly with
              our powerful tools.
            </p>
    </div>
  </div>
</div>

      </div>

      {/* Category Container */}
      <div className="category-container">
        <div className="slogan-section">
          <h2 className="text-center slogan">
            "Empowering Education Through Collaboration and Innovation"
          </h2>
           <div className="category-buttons text-center mt-4">
          {[
            { icon: faBookOpen, title: 'Education', variant: 'primary' },
            { icon: faLaptopCode, title: 'Science & Technology', variant: 'success' },
            { icon: faCog, title: 'Engineering', variant: 'danger' },
            { icon: faGraduationCap, title: 'Computer Science', variant: 'info' },
            { icon: faPaintBrush, title: 'Art & Design', variant: 'warning' }
          ].map((category, index) => (
            <Card className="category-card" key={index} style={{ width: '18rem', display: 'inline-block', margin: '0 10px' }}>
              <Card.Body className="text-center">
                <FontAwesomeIcon icon={category.icon} size="3x" className="mb-3" />
                <Card.Title>{category.title}</Card.Title>
              </Card.Body>
            </Card>
          ))}
        </div>
        </div>
      </div>

      {/* Footer Container */}
      <div className="footer-container">
        <footer className="footer mt-4">
          <div className="container text-center">
            <p>&copy; 2024 NoteSharing. All rights reserved.</p>
            <p>
              Address: 1234 NoteSharing Ave, Document City, DS 56789<br />
              Contact: info@notesharing.com | Phone: +123 456 7890
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
