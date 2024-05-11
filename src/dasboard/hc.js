import React, { useState, useEffect } from 'react';
import AuthUser from '../component/AuthUser';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import LoadingBar from 'react-top-loading-bar';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function Home() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [userData, setUserData] = useState([]);
    const { http } = AuthUser();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        http.get('/fetchdata')
            .then((res) => {
                const data = res.data.data;
                const groupedData = groupDataByUser(data);
                setUserData(groupedData);
                setLoading(false);
                setProgress(100);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
                setProgress(100);
            });
    }

    const groupDataByUser = (data) => {
        const groupedData = {};
        data.forEach(item => {
            if (!groupedData[item.user_id]) {
                groupedData[item.user_id] = [];
            }
            groupedData[item.user_id].push(item);
        });
        return groupedData;
    };

    
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







    return (
        <>
            <LoadingBar
                color='#f11946'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />

            {!loading ? (
                <div style={{ margin: '0px 10%' }}>
                    {Object.keys(userData).map(userId => (
                        <div key={userId} style={{ marginBottom: '20px' }}>
                            
                                {userData[userId].map((item, index) => (
                                  <>
                                  <Card>
                                    <div key={index}>
                                        <Card.Header style={{ display: 'flex', alignItems: 'center' }}>
                                            <Card.Img 
                                                variant="bottom"
                                                src={"http://127.0.0.1:8000/avatar/" + item.avatar}
                                                style={{ width: "5%", borderRadius: "50%", marginLeft: "0px", display: "block" }}
                                            />
                                              {item.firstname.charAt(0).toUpperCase() + item.firstname.slice(1)}
                                            <br/>
                                            {/* Display the formatted time */}
                                           {formatTime(item.created_at)}
                                           
                                        </Card.Header>
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
                                                <>
                                                    <iframe src={"http://127.0.0.1:8000/files/" + item.file} width="500px" height="500px"></iframe>
                                                    <Button 
                                                        variant="primary"
                                                        onClick={() => {
                                                            // Add functionality to initiate download
                                                        }}
                                                    >
                                                        Download
                                                    </Button>
                                                </>
                                            )}
                                            
                                        </Card.Body>

                                    </div>

                                </Card>
                                <br/>
                                </>
                                ))}
                            
                        </div>
                    ))}
                </div>
            ) : (
                <div><h1>Loading...</h1></div>
            )}
        </>
    )
}

export default Home;
