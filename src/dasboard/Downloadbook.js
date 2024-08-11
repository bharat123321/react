import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import { Spinner } from 'react-bootstrap';
import { BiDotsVertical } from 'react-icons/bi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobeAmericas, faThumbsUp as faThumbsUpSolid, faBookmark as faBookmarkSolid, faReply, faThumbsUp as faThumbsUpRegular } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
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
  const [userid,setUsersid] = useState();
  const [comments, setComments] = useState([]);
  const [editcomments,setEditcommenst] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const { http } = AuthUser();
  const { id } = useParams();

  useEffect(() => {
    fetchData(id);
    fetchComments(id);
  }, [id]);

  const fetchData = async (id) => {
    try {
      setProgress(50);
      const res = await http.get(`/fetchbookdetail/${id}`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      const { data, likescount, likepost, bookmark,users } = res.data;
      console.log("Fetched data:", data);
        console.log("users",users);
      if (Array.isArray(data) && data.length > 0) {
        setUserData(data);
        setBookmarked(bookmark);
        setLiked(likepost);
        setLikeCount(likescount);
        setUsersid(users);
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

  const fetchComments = (post_id) => {
    http.get(`/comments/${post_id}`)
      .then(res => {
        setComments(res.data);
        console.log(res.data);
      })
      .catch(error => {
        console.error("Error fetching comments:", error);
      });
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

  const handleCommentSubmit = () => {
    if (commentText.trim() === '') return;

    http.post('/comments', {
      post_id: id,
      comments: commentText,
    }, {
      withCredentials: true,
    })
      .then(() => {
        fetchComments(id); // Re-fetch comments to update the list
        setCommentText('');
        toast.success('Comment added!');
      })
      .catch(error => {
        console.error('Error posting comment:', error);
        toast.error('Failed to post comment.');
      });
  };

  const handleCommentEdit = (commentId, newContent) => {
    http.put(`/comments/${commentId}`, {
      content: newContent,
    }, {
      withCredentials: true,
    })
      .then(res => {
        setComments(comments.map(comment =>
          comment.id === commentId ? res.data : comment
        ));
        setEditingCommentId(null);
        fetchComments(id); // Re-fetch comments to update the list
         
        toast.success('Comment added!');
      })
      .catch(error => {
        console.error('Error editing comment:', error);
        toast.error('Failed to edit comment.');
      });
  };

  const handleCommentDelete = (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      http.delete(`/comments/${commentId}`, {
        withCredentials: true,
      })
      .then(() => {
        fetchComments(id); // Re-fetch comments to update the list
        toast.success('Comment deleted!');
      })
      .catch(error => {
        console.error('Error deleting comment:', error);
        toast.error('Failed to delete comment.');
      });
    }
  };
  
  const handleReplySubmit = (commentId) => {
    if (replyText.trim() === '') return;

    http.post('/replies', {
      comment_id: commentId,
      reply: replyText,
    }, {
      withCredentials: true,
    })
      .then(() => {
        fetchComments(id); // Re-fetch comments to update the list
        setReplyText('');
        setReplyingToCommentId(null);
        toast.success('Reply added!');
      })
      .catch(error => {
        console.error('Error posting reply:', error);
        toast.error('Failed to post reply.');
      });
  };

  const handleReplyLike = async (replyId) => {
    try {
      const res = await http.post(`/replylike`, { replyId }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      if (res.status === 200) {
        toast.success('Reply liked!');
      }
    } catch (error) {
      console.error("Error liking reply:", error);
      toast.error('Failed to like reply.');
    }
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
                          <Dropdown.Item onClick={() => handleDownload(item.id)}>Download</Dropdown.Item>
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
                    <Button variant="primary" style={{ marginTop: '5px' }} onClick={handleCommentSubmit}>
                      Submit
                    </Button>
                    
                    {/* Comments Section */}
                    <div style={{ marginTop: '20px' }}>
                      {comments.length > 0 ? (
                        comments.map((comment) => (
                          <div key={comment.id} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <div>
                              
                         <img 
                           src={comment.avatar && comment.avatar.startsWith('http') ? comment.avatar : `http://localhost:8000/avatar/${comment.avatar || 'default-avatar.png'}`} 
                           height="30px" 
                           style={{ marginLeft:"-10px", borderRadius: '50%' }} 
                           alt="User Profile"
                         />
                                <strong>{comment.firstname} {comment.lastname}</strong> - {comment.formatted_date}
                                <br/>
                              </div>
                              <div>
                              {comment.user_id === userid.id &&  
                               <div>
                                {editingCommentId === comment.id ? (
                                  <>
                                    <textarea
                                      defaultValue={comment.comment}
                                      onChange={(e) => setEditcommenst(e.target.value)}
                                       style={{marginBottom:"5px"}}
                                    />
                                    <br/>
                                    <Button variant="link" onClick={() => handleCommentEdit(comment.id, editcomments)}>
                                      Save
                                    </Button>
                                    <Button variant="link" onClick={() => setEditingCommentId(null)}>
                                      Cancel
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button variant="link" onClick={() => setEditingCommentId(comment.id)}>
                                      Edit
                                    </Button>
                                    <Button variant="link" onClick={() => handleCommentDelete(comment.id)}>
                                      Delete
                                    </Button>
                                    
                                  </>
                                )}
                             
                              </div>
                      }
                       <Button variant="link" onClick={() => setReplyingToCommentId(comment.id)}>
                                      <FontAwesomeIcon icon={faReply} /> Reply
                                    </Button>
                              </div>
                            </div>
                            {editingCommentId !== comment.id && <div>{comment.comment}</div>}
                            
                            {/* Reply Section */}
                            {replyingToCommentId === comment.id && (
                              <div style={{ marginTop: '10px' }}>
                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Write a reply..."
                                  style={{ width: '100%', marginBottom: '5px' }}
                                />
                                <Button variant="primary" onClick={() => handleReplySubmit(comment.id)}>
                                  Reply
                                </Button>
                                {/* Replies List */}
                                <div style={{ marginTop: '10px' }}>
                                  {comment.replies && comment.replies.length > 0 ? (
                                    comment.replies.map((reply) => (
                                      <div key={reply.id} style={{ marginBottom: '5px', border: '1px solid #ccc', padding: '5px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                          <div>
                                            <strong>{reply.firstname} {reply.lastname}</strong> - {reply.formatted_date}
                                            <br/>
                                          </div>
                                          <div>
                                            <Button variant="link" onClick={() => handleReplyLike(reply.id)}>
                                              <FontAwesomeIcon icon={faThumbsUpRegular} /> Like
                                            </Button>
                                          </div>
                                        </div>
                                        <div>{reply.reply}</div>
                                      </div>
                                    ))
                                  ) : (
                                    <p>No replies yet.</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p>No comments available.</p>
                      )}
                    </div>
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
