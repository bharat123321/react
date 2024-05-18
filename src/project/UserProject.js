import React, { useState, useEffect } from 'react';
import AuthUser from '../component/AuthUser';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import LoadingBar from 'react-top-loading-bar';
import Carousel from 'react-bootstrap/Carousel';
import { BiDotsVertical } from 'react-icons/bi';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const UserProject = () => {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [userData, setUserData] = useState([]);
    const [openDropdowns, setOpenDropdowns] = useState([]); // Array to track dropdown visibility
    const { http } = AuthUser();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        http.get('/fetchdata')
            .then((res) => {
                const data = res.data.checks;
                setUserData(data);
                console.log(res.data);
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
              <div style={{ margin: '0px 10%' }}>
                <h1>Project</h1>
            </div>

            ) : (
                <div><h1>Loading...</h1></div>
            )}
        </>
    )
}

export default UserProject;
