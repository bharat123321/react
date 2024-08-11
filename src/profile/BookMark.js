import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import AuthUser from '../component/AuthUser';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import '../dasboard/Book.css';
import Pagepdf from '../dasboard/Pagepdf';
import { Link } from 'react-router-dom';

function BookMark() {
    const { http } = AuthUser();
    const [bookmarkData, setBookmarkData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const fetchBookmarks = () => {
        http.get('/fetchbookmarks')
            .then((res) => {
                const data = res.data.data;
                setBookmarkData(data);
                console.log(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching bookmarks:", error);
                setLoading(false);
            });
    };

    const handleDownload = async (id) => {
        try {
            const response = await http.get(`/downloadpdf/${id}`, {
                responseType: 'blob',
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
    };

    const groupByTopic = () => {
        const groupedData = {};
        bookmarkData.forEach(item => {
            if (!groupedData[item.topic]) {
                groupedData[item.topic] = [];
            }
            groupedData[item.topic].push(item);
        });
        return groupedData;
    };

    const groupedData = groupByTopic();

    return (
        <div style={{ marginTop: "0px" }}>
            {loading ? (
                <p>Loading...</p>
            ) : bookmarkData.length === 0 ? (
                <p>No bookmarks found.</p>
            ) : (
                <>
                    {Object.keys(groupedData).map((topic, index) => (
                        <div key={index} className="topic-container">
                            <div className="topic-scroll-wrapper">
                                <div className="topic-cards" id={`scroll-${topic}`}>
                                    {groupedData[topic].map((item, i) => (
                                        <Card key={i} className="custom-card">
                                            <div className="pdf-preview">
                                                <Pagepdf url={`http://127.0.0.1:8000/api/files/${item.file}`} />
                                                <p className="designPdf">PDF</p>
                                            </div>
                                            <Card.Body className="d-flex flex-column justify-content-between">
                                                <div>
                                                    <Card.Title>{item.topic}</Card.Title>
                                                    <Card.Text className="nav-link text-left" as={Link} to={`/viewdetail/${item.id}`}><b style={{ fontSize: "12px" }}>Added By {item.firstname} ...</b></Card.Text>
                                                </div>
                                                <Button variant="primary" onClick={() => handleDownload(item.id)}>Download</Button>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

export default BookMark;
