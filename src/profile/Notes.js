
import React, { useState, useEffect } from 'react';
import AuthUser from '../component/AuthUser';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import LoadingBar from 'react-top-loading-bar';
import Carousel from 'react-bootstrap/Carousel';
import { BiDotsVertical } from 'react-icons/bi';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobeAmericas } from '@fortawesome/free-solid-svg-icons';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
const Notes = () => {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [userData, setUserData] = useState([]);
    const [openDropdowns, setOpenDropdowns] = useState([]); // Array to track dropdown visibility
    const { http } = AuthUser();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // Initialize openDropdowns array with false values for each user
        setOpenDropdowns(new Array(userData.length).fill(false));
    }, [userData]);

    const fetchData = () => {
        http.get('/fetchcreateddata')
            .then((res) => {
                const data = res.data.fetchdata;
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
                                    style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }}
                                />
                                <div>
                                    <h4 style={{ margin: 0 }}>{item.firstname.charAt(0).toUpperCase() + item.firstname.slice(1)} {item.lastname}</h4>
                                    <h6 style={{ fontSize: "12px", color: "#888" }}><FontAwesomeIcon icon={faGlobeAmericas} /> {item.formatted_date}</h6>
                                    
                                </div>

                     <div className="HiddenIcon" style={{ alignSelf: 'flex-end', marginTop: '10px' }}>
                                <Dropdown>
                                    <Dropdown.Toggle variant="link" bsPrefix="p-2">
                                        <BiDotsVertical />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item as={Link} to={`/convertimgtopdf/${item.id}`}>Preview</Dropdown.Item>
                                        <Dropdown.Item >Download</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                </Card.Header>
                <Card.Body>
                   <h3>{item.subjectname}</h3>
                    {item.image && (
                        <Carousel>
                            {item.image.split(',').map((imageName, imageIndex) => (
                                <Carousel.Item key={imageIndex}>
                                    <img
                                        className="d-block w-100"
                                        src={"http://127.0.0.1:8000/classimage/" + imageName.trim()}
                                        alt={`Image ${imageIndex}`}
                                    />
                                    
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    )}

                    {item.file && (
                                <>
                              {console.log(`http://127.0.0.1:8000/classimage/${item.image}`)}
                    <object data={`http://127.0.0.1:8000/classimage/${item.image}`} type="application/pdf" width="100%" height="100%"></object>
  </>
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

export default Notes;
