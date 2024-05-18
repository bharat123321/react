import React, { useState, useEffect } from 'react';
import AuthUser from '../component/AuthUser';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import LoadingBar from 'react-top-loading-bar';
import Carousel from 'react-bootstrap/Carousel';
import { BiDotsVertical } from 'react-icons/bi';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const SelectedNotes = (props) => {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [userData, setUserData] = useState([]);
    const [openDropdowns, setOpenDropdowns] = useState([]); // Array to track dropdown visibility
    const { http } = AuthUser();
    const code = props.data;

    useEffect(() => {
        console.log("Fetching data for code:", code);
        setLoading(true);
        setProgress(30); // Start the progress bar
        fetchData();
    }, [code]);

    useEffect(() => {
        // Initialize openDropdowns array with false values for each user
        setOpenDropdowns(new Array(userData.length).fill(false));
    }, [userData]);

    const fetchData = () => {
        http.get('/fetchupload/' + code)
            .then((res) => {
                const data = res.data.checks;
                setUserData(data);
                console.log("Data fetched:", res.data);
                setLoading(false);
                setProgress(100); // Complete the progress bar
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
                setProgress(100); // Complete the progress bar even if there is an error
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

    const handleDropDown = (index) => {
        const updatedDropdowns = [...openDropdowns];
        updatedDropdowns[index] = !updatedDropdowns[index]; // Toggle visibility for the clicked user's dropdown
        setOpenDropdowns(updatedDropdowns);
    }

    return (
        <>
            <LoadingBar
                color='#f11946'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            {!loading ? (
                userData && userData.length > 0 ? (
                    <div style={{ margin: '0px 10%' }}>
                        {userData.map((item, index) => (
                            <Card key={item.id} style={{ margin: "auto" }} className="col-md-8 col-md-offset-1">
                                <div>
                                    <Card.Header style={{ display: 'flex', alignItems: 'center' }}>
                                        <Card.Img
                                            variant="bottom"
                                            src={"http://127.0.0.1:8000/avatar/" + item.avatar}
                                            style={{ width: "5%", borderRadius: "5%", marginLeft: "0px", marginTop: "-10px", display: "block" }}
                                        />
                                        <div>
                                            <h4 style={{ paddingLeft: "10px", marginBottom: "0" }}>
                                                {item.firstname.charAt(0).toUpperCase() + item.firstname.slice(1)} {item.lastname.charAt(0).toUpperCase() + item.lastname.slice(1)}
                                            </h4>
                                            <h6 style={{position:"absolute",right:"0px"}}>{item.subjectname}</h6> 
                                            <h6 style={{ paddingLeft: "10px", marginTop: "0px" }}> {formatTime(item.created_at)}</h6>
                                        </div>
                                        <div className="HiddenIcon">
                                            <BiDotsVertical onClick={() => handleDropDown(index)} className="dropbtn" />
                                            <div id={`myDropdown-${index}`} style={{ display: openDropdowns[index] ? 'block' : 'none' }} className="dropdown-content">
                                                <a href="#">Download</a>
                                                <a href="#">Preview</a>
                                            </div>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
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
                                            <h1>hello</h1>
                                        )}
                                    </Card.Body>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div><h1>No data available</h1></div>
                )
            ) : (
                <div><h1>Loading...</h1></div>
            )}
        </>
    )
}

export default SelectedNotes;
