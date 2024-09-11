import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import AuthUser from '../component/AuthUser';
import Pagepdf from '../dasboard/Pagepdf';
import Spinner from 'react-bootstrap/Spinner';
import './PostVerified.css';
import { Link ,useNavigate} from 'react-router-dom';
const PostVerified = () => {
  const { http } = AuthUser();
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFilewithUser = () => {
    http.get('postwithuser')
      .then((res) => {
        console.log(res.data.data);
        setUser(res.data.data);
        setLoading(false);  
      })
      .catch((error) => {
        console.log("Error response", error);
        setLoading(false);  
      });
  };

  useEffect(() => {
    fetchFilewithUser();
  }, []);

  const handleAccept = (id) => {
    console.log('Accepted post with ID:', id);
    http.get(`/acceptpostverfied/${id}`)
      .then((res) => {
        console.log(res.data);
        // Remove the accepted post from the user state
        setUser((prevUser) => prevUser.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.log("Error accepting post:", error);
      });
  };

  const handleDelete = (id) => {
if (window.confirm("Are you sure you want to delete this comment?")) {
    http.delete(`/deletepost/${id}`)
      .then((res) => {
        console.log(res.data);
        // Remove the deleted post from the user state
        setUser((prevUser) => prevUser.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.log("Error deleting post:", error);
      });
    }
  };

  return (
    <div className="post-verified-container" style={{ marginTop: "130px" }}>
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        user.length > 0 ? (
          <div className="row">
            {user.map((item, index) => (
              <div className="col-md-4" key={item.id}>
                <Card className="mb-4 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <Card.Title>
                        <Card.Img
                          variant="bottom"
                          src={`http://localhost:8000/avatar/${item.avatar}`}
                          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                        />
                        {item.firstname} {item.lastname}
                        <br/>
                        <p style={{fontSize: "10px", paddingLeft: "50px"}}>{item.formatted_date}</p>
                      </Card.Title>
                    </div>
                    <Link to={`/todownloadbook/${item.id}`} style={{ cursor: "pointer",textDecoration:"none" }}>
                    <Card key={index} className="custom-card" style={{margin:"auto"}}>
                      <div className="pdf-preview mt-3" style={{ cursor: 'pointer' }}>
                        <Pagepdf url={`http://127.0.0.1:8000/api/files/${item.file}`} />
                        <p className="designPdf" style={{color:"white" }}>PDF</p>
                      </div>
                    </Card>
                    </Link>
                    <div className="d-flex justify-content-between mt-4">
                      <Button variant="success" onClick={() => handleAccept(item.id)}>
                        <i className="bi bi-check-circle"></i> Accept
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(item.id)}>
                        <i className="bi bi-x-circle"></i> Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <p>No posts available for verification.</p>
        )
      )}
    </div>
  );
};

export default PostVerified;
