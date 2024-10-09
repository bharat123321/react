import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import { Spinner } from 'react-bootstrap';
import { BiDotsVertical } from 'react-icons/bi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobeAmericas, faComment, faThumbsUp as faThumbsUpSolid ,faBookmark as faBookmarkUpSolid} from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as faThumbsUpRegular, faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import Fetchpdf from './Fetchpdf';
import EmojiPicker from 'emoji-picker-react';
import LoadingBar from 'react-top-loading-bar';

function Viewbook() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState({});
  const [commentText, setCommentText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const { id } = useParams();

  useEffect(() => {
    fetchData(id);
  }, [id]);

  const fetchData = (id) => {
    setProgress(50);
    axios.get(`http://127.0.0.1:8000/api/fetchbookid/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    })
      .then((res) => {
        const data = res.data.data;
        console.log(data);
        setUserData(data);
        setLoading(false);
        setProgress(100);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
        setProgress(100);
      });
  };

  const toggleShowFull = (index) => {
    setExpanded(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  const onEmojiClick = (emojiObject) => {
    setCommentText((prevText) => prevText + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const toggleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(likeCount - 1);
    } else {
      setLiked(true);
      setLikeCount(likeCount + 1);
    }
  };

  return (
    <div>
      <LoadingBar color="#f11946" progress={progress} onLoaderFinished={() => setProgress(0)} />
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="sr-only"></span>
        </Spinner>
      ) : (
        <div>
          {userData.map((item, index) => {
            const topic = item?.description || '';
            const truncatedText = topic.split(' ').slice(0, 3).join(' ');
            const isLongDescription = topic.split(' ').length > 3;
            const isExpanded = expanded[index];

            return (
              <Card key={index} className="col-md-8 col-md-offset-1" style={{ margin: "auto" }}>
                <Card.Header style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Card.Img
                      variant="bottom"
                      src={`http://localhost:8000/avatar/${item.avatar}`}
                      style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }}
                    />
                    <div>
                      <h4 style={{ margin: 0 }}>{item.firstname.charAt(0).toUpperCase() + item.firstname.slice(1)} {item.lastname}</h4>
                      <h6 style={{ fontSize: "12px", color: "#888" }}><FontAwesomeIcon icon={faGlobeAmericas} /> {item.formatted_date}</h6>
                    </div>
                  </div>
                  <div className="HiddenIcon" style={{ alignSelf: 'flex-end', marginTop: '10px' }}>
                    <Dropdown>
                      <Dropdown.Toggle variant="link" bsPrefix="p-2">
                        <BiDotsVertical />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item as={Link} to="/Login">Download</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Card.Header>
                <Card.Body className="justify-content-between">
                  <Card.Title>{item.topic}</Card.Title>
                  <Card.Text>
                    {isExpanded ? topic : `${truncatedText}${isLongDescription ? '...' : ''}`}
                    {isLongDescription && (
                      <a onClick={() => toggleShowFull(index)} style={{ cursor: 'pointer', color: 'brown' }}>
                        {isExpanded ? 'Show less' : 'Show more'}
                      </a>
                    )}
                  </Card.Text>
                  <Fetchpdf url={`http://127.0.0.1:8000/api/files/${item.file}`} />
                  
                  <FontAwesomeIcon
                    icon={bookmarked ? faBookmarkUpSolid : faBookmarkRegular}
                    onClick={toggleBookmark}
                    style={{ cursor: 'pointer', color: bookmarked ? 'black' : 'gray', marginRight: '10px' }}
                  />
                  <FontAwesomeIcon
                    icon={liked ? faThumbsUpSolid : faThumbsUpRegular}
                    onClick={toggleLike}
                    style={{ cursor: 'pointer', color: liked ? 'black' : 'gray', marginRight: '10px' }}
                  />
                  <span>{likeCount}</span>
                   
                </Card.Body>
              
              </Card>

            );
          })}
          <br/>
        </div>
      )}
    </div>
  );
}

export default Viewbook;
