import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import AuthUser from '../component/AuthUser';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import '../dasboard/Book.css';
import Pagepdf from '../dasboard/Pagepdf';
import { Link} from 'react-router-dom';
function Books() {
    const { http } = AuthUser();
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDatas();
    }, []);

    const fetchDatas = () => {
        http.get('/fetchbookcollection')
            .then((res) => {
                const data = res.data.data;
                setUserData(data);
                console.log(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    };

    const handleDownload = async (id) => {
        try {
            const response = await http.get(`/downloadpdf/${id}`, {
                responseType: 'blob', // Important
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'document.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading the file', error);
        }
    }

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

    return (
        
        <div className="scrollable-container" style={{marginTop:"0px"}}>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {Object.keys(groupedData).map((topic, index) => (
                        <div key={index} className="topic-container">
                            <h2>{topic}</h2>
                            <div className="topic-scroll-wrapper">
                                <button className="scroll-button left" onClick={() => scrollLeft(topic)}>
                                    <FiChevronLeft />
                                </button>
                                <div className="topic-cards" id={`scroll-${topic}`}>
                                    {groupedData[topic].map((item, i) => (
                                        <Card key={i} className="custom-card">
                                            <div className="pdf-preview">
                                                <Pagepdf url={`http://127.0.0.1:8000/api/files/${item.file}`} />
                                                <p className="designPdf" style={{color:"white"}}>PDF</p>
                                                             </div>
                                            <Card.Body className="d-flex flex-column justify-content-between">
                                                <div>  
                                                    <Card.Title>{item.topic}</Card.Title>
                                                    <Card.Text className="nav-link text-left" as={Link} to={`/viewdetail/${item.id}`}><b style={{fontSize:"12px"}}>Added By {item.firstname} ...</b></Card.Text>
                                                </div>
                                                <Button variant="btn btn-success"as={Link} to={`/viewbook/${item.id}`}>View</Button>
                                            </Card.Body>

                                        </Card>

                                    ))}

                                </div>
                                <button className="scroll-button right" onClick={() => scrollRight(topic)}>
                                    <FiChevronRight />
                                </button>
                            </div>
                            <hr/>
                        </div>

                    ))}

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

export default Books;
