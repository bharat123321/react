import React, { useState, useEffect } from 'react';
import AuthUser from '../component/AuthUser';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import LoadingBar from 'react-top-loading-bar';
import Carousel from 'react-bootstrap/Carousel';
import Dropdown from 'react-bootstrap/Dropdown';
import { BiDotsVertical } from 'react-icons/bi';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { pdfjs } from 'react-pdf';
import { Document, Page } from 'react-pdf';
import PDFViewer from './PDFViewer';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function Home() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [userData, setUserData] = useState([]);
    const { http } = AuthUser();
    const [showPDF, setShowPDF] = useState(true);
    const [pdf, setPdf] = useState(null); // State to store PDF object
    const [numPages, setNumPages] = useState();
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    } 

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        http.get('/fetchdata')
            .then((res) => {
                const data = res.data.data;
                setUserData(data);
                console.log(data);
                setLoading(false);
                setProgress(100);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
                setProgress(100);
            });
    }

    const formatTime = (timestamp) => {
        const now = new Date(); // Current time
        const uploadTime = new Date(timestamp); // Time of the image upload

        // Calculate the time difference in milliseconds
        const difference = now.getTime() - uploadTime.getTime();

        // Convert milliseconds to seconds
        const differenceInSeconds = Math.floor(difference / 1000);

        // Define the time units and their respective thresholds
        const timeUnits = [
            { unit: 'year', threshold: 31536000 },
            { unit: 'week', threshold: 604800 },
            { unit: 'day', threshold: 86400 },
            { unit: 'hour', threshold: 3600 },
            { unit: 'minute', threshold: 60 },
            { unit: 'second', threshold: 1 }
        ];

        // Iterate through time units to find the appropriate unit to display
        for (const unit of timeUnits) {
            if (differenceInSeconds >= unit.threshold) {
                const value = Math.floor(differenceInSeconds / unit.threshold);
                return `${value} ${unit.unit}${value !== 1 ? 's' : ''} ago`;
            }
        }

        // If the time difference is less than 1 second
        return `just now`;
    };

    const loadPdf = async (pdfUrl) => {
        console.log(pdf);
        alert(pdf);
    }

    useEffect(() => {
        if (pdf) {
            // Do something with the PDF object
            console.log('PDF loaded:', pdf);
        }
    }, [pdf]);

    return (
        <>
            <LoadingBar
                color='#f11946'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />

            {!loading ? (
                <div style={{ margin: '0px 10%' }}>
                    {userData.map((item, index) => (
                        <>
                        <Card key={index} style={{ margin: "auto" }} className="col-md-8 col-md-offset-1">
                            <div>
                                <Card.Header style={{ display: 'flex', alignItems: 'center' }}>
                                    <Card.Img
                                        variant="bottom"
                                        src={"http://127.0.0.1:8000/avatar/" + item.avatar}
                                        style={{ width: "5%", borderRadius: "5%", marginLeft: "0px", display: "block" }}
                                    />
                                    <h4 style={{ paddingLeft: "10px" }}>{item.firstname.charAt(0).toUpperCase() + item.firstname.slice(1)}</h4>
                                    <br />
                                    <div className="HiddenIcon">
                                        <Dropdown>
                                            <Dropdown.Toggle variant="link" bsPrefix="p-0">
                                                <BiDotsVertical />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item href="#">Download</Dropdown.Item>
                                                <Dropdown.Item href="#">Preview</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </Card.Header>
                                <h6 style={{ paddingLeft: "49px" }}> {formatTime(item.created_at)}</h6>
                                <hr />
                                <Card.Body>
                                    {/* Render carousel for multiple images */}
                                    {item.image && (
                                        <Carousel>
                                            {item.image.split(',').map((imageName, imageIndex) => (
                                                <Carousel.Item key={imageIndex}>
                                                    <img
                                                        className="d-block w-100"
                                                        src={"http://127.0.0.1:8000/images/" + imageName.trim()}
                                                        alt={`Image ${imageIndex}`}
                                                    />
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>
                                    )}

                                    {item.file && (
                                        <PDFViewer pdfUrl={`http://127.0.0.1:8000/files/${item.file}`} />
                                    )}
                                </Card.Body>
                            </div>
                        </Card>
                        <br/>
                        </>
                    ))}
                </div>
            ) : (
                <div><h1>Loading...</h1></div>
            )}
        </>
    )
}

export default Home;
