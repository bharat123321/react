import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import { Spinner } from 'react-bootstrap';
import { BiDotsVertical } from 'react-icons/bi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobeAmericas, faThumbsUp as faThumbsUpSolid, faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as faThumbsUpRegular, faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import Fetchdata from './Fetchdata';
import EmojiPicker from 'emoji-picker-react';
import LoadingBar from 'react-top-loading-bar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthUser from '../component/AuthUser';

function Downloadbook() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState({});
  const [commentText, setCommentText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { http } = AuthUser();
  const { id } = useParams();

  useEffect(() => {
    fetchData(id);
  }, [id]);

  const fetchData = async (id) => {
    try {
      setProgress(50);
      const res = await http.get(`/fetchbookdetail/${id}`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      const { data, likescount, likepost, bookmark } = res.data;
      console.log("Fetched data:", data);

      if (Array.isArray(data) && data.length > 0) {
        setUserData(data);
        setBookmarked(bookmark);
        setLiked(likepost);
        setLikeCount(likescount);
      } else {
        console.error("Data is not an array:", data);
      }
      setLoading(false);
      setProgress(100);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      setProgress(100);
    }
  };

  const toggleShowFull = (index) => {
    setExpanded((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const onEmojiClick = (emojiObject) => {
    setCommentText((prevText) => prevText + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleBookmark = async () => {
    try {
      const res = await http.post(
        `/bookmark`,
        { id: id },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        setBookmarked((prev) => !prev);
        toast.success(bookmarked ? 'Bookmark removed!' : 'Bookmarked!');
      }
    } catch (error) {
      console.error("Error bookmarking:", error);
      toast.error('Failed to bookmark.');
    }
  };

  const handleLike = async () => {
    try {
      const res = await http.post(
        `/like`,
        { id: id },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        setLiked((prev) => !prev);
        setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
        toast.success(liked ? 'Like removed!' : 'Liked!');
      }
    } catch (error) {
      console.error("Error liking:", error);
      toast.error('Failed to like.');
    }
  };

  return (
    <div>
      <LoadingBar color="#f11946" progress={progress} onLoaderFinished={() => setProgress(0)} />
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <div>
          {Array.isArray(userData) && userData.length > 0 ? (
            userData.map((item, index) => {
              const topic = item?.description || '';
              const truncatedText = topic.split(' ').slice(0, 3).join(' ');
              const isLongDescription = topic.split(' ').length > 3;
              const isExpanded = expanded[index];

              return (
                <Card key={index} className="col-md-8 col-md-offset-1" style={{ margin: '100px auto' }}>
                  <Card.Header style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Card.Img
                        variant="bottom"
                        src={`http://localhost:8000/avatar/${item.avatar}`}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
                      />
                      <div>
                        <h4 style={{ margin: 0 }}>
                          {item.firstname.charAt(0).toUpperCase() + item.firstname.slice(1)} {item.lastname}
                        </h4>
                        <h6 style={{ fontSize: '12px', color: '#888' }}>
                          <FontAwesomeIcon icon={faGlobeAmericas} /> {item.formatted_date}
                        </h6>
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
                    <Fetchdata url={`http://127.0.0.1:8000/api/files/${item.file}`} />
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                      <FontAwesomeIcon
                        icon={bookmarked ? faBookmarkSolid : faBookmarkRegular}
                        onClick={handleBookmark}
                        style={{ cursor: 'pointer', color: bookmarked ? 'black' : 'gray', marginRight: '10px' }}
                      />
                      <FontAwesomeIcon
                        icon={liked ? faThumbsUpSolid : faThumbsUpRegular}
                        onClick={handleLike}
                        style={{ cursor: 'pointer', color: liked ? 'black' : 'gray', marginRight: '10px' }}
                      />
                      <span>{likeCount}</span>
                    </div>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        style={{ width: '100%', paddingRight: '40px', marginTop: '10px' }}
                      />
                      <Button
                        variant="link"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          zIndex: 2,
                          padding: '0',
                        }}
                      >
                        😊
                      </Button>
                      {showEmojiPicker && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '100%',
                            right: '0',
                            zIndex: 3,
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            backgroundColor: 'white',
                          }}
                        >
                          <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                      )}
                    </div>
                    <Button variant="primary" style={{ marginTop: '5px' }}>
                      Submit
                    </Button>
                  </Card.Body>
                </Card>
              );
            })
          ) : (
            <p>No data available.</p>
          )}
          <ToastContainer />
        </div>
      )}
    </div>
  );
}

export default Downloadbook;
