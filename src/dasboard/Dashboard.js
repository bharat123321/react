import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import AuthUser from '../component/AuthUser';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import Pagepdf from './Pagepdf';
import { Link, useNavigate } from 'react-router-dom';
import { BiPlus } from 'react-icons/bi';
import Upload from './Upload';

function Dashboard() {
  const { http } = AuthUser();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('Image');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDatas();
  }, []);

  const fetchDatas = () => {
    http.get('/fetchdata')
      .then((res) => {
        setUserData(res.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const groupByTopic = () => {
    const groupedData = {};
    userData.forEach(item => {
      if (!groupedData[item.category]) {
        groupedData[item.category] = [];
      }
      groupedData[item.category].push(item);
    });
    return groupedData;
  };

  const groupedData = groupByTopic();

  const handleUploadClick = () => {
    setShowUploadOptions(!showUploadOptions);
  };

  const handleFile = () => {
    setSelectedEvent('File');
    setShow(true);
    setShowUploadOptions(false);
  };

  const handleImage = () => {
    setSelectedEvent('Image');
    setShow(true);
    setShowUploadOptions(false);
  };

  const handleCard = (id) => {
    navigate(`/todownloadbook/${id}`);
  };

  return (
    <div className="scrollable-container" style={{ marginTop: "110px" }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {Object.keys(groupedData).map((topic, index) => (
            <div key={index} className="topic-container">
              <h2>{topic}</h2>
              <div className="topic-scroll-wrapper" style={{ position: 'relative' }}>
                <button className="scroll-button left" onClick={() => scrollLeft(topic)}>
                  <FiChevronLeft />
                </button>
                <div className="topic-cards" id={`scroll-${topic}`}>
                  {groupedData[topic].map((item, i) => (
                    <Link to={`/todownloadbook/${item.id}`} key={i} style={{ cursor: "pointer", textDecoration: "none" }}>
                      <Card className="custom-card">
                        <div className="pdf-preview">
                          <Pagepdf url={`http://127.0.0.1:8000/api/files/${item.file}`} />
                          <p className="designPdf" style={{ color: "white" }}>PDF</p>
                        </div>
                        <Card.Body className="d-flex flex-column justify-content-between">
                          <div>
                            <Card.Title>{item.topic}</Card.Title>
                            <Card.Text><b style={{ fontSize: "12px" }}>Added By {item.firstname} ...</b></Card.Text>
                          </div>
                        </Card.Body>
                      </Card>
                    </Link>
                  ))}
                </div>
                <button className="scroll-button right" onClick={() => scrollRight(topic)}>
                  <FiChevronRight />
                </button>
              </div>
            </div>
          ))}

          {/* Floating Upload Button */}
          <Button
            variant="primary"
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              backgroundColor: 'black'
            }}
            onClick={handleUploadClick}
          >
            <BiPlus size={30} />
          </Button>

          {/* Upload Options */}
          {showUploadOptions && (
            <div style={{
              position: 'fixed',
              bottom: '90px',
              right: '20px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              zIndex: 1000
            }}>
              <ul style={{ listStyleType: 'none', margin: 0, padding: '10px' }}>
                <li style={{ padding: '10px', cursor: 'pointer' }} onClick={handleFile}>Upload Single File</li>
              </ul>
            </div>
          )}

          <Upload event={selectedEvent} show={show} setShow={setShow} />
        </>
      )}
    </div>
  );

  function scrollLeft(topic) {
    const scrollContainer = document.getElementById(`scroll-${topic}`);
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: -200, behavior: 'smooth' });
    }
  }

  function scrollRight(topic) {
    const scrollContainer = document.getElementById(`scroll-${topic}`);
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: 200, behavior: 'smooth' });
    }
  }
}

export default Dashboard;
