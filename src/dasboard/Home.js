import React, { useState, useEffect } from 'react';
import AuthUser from '../component/AuthUser';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import LoadingBar from 'react-top-loading-bar';
import Carousel from 'react-bootstrap/Carousel';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
import Dropdown from 'react-bootstrap/Dropdown';
import { Modal,Spinner} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { BiDotsVertical, BiPlus } from 'react-icons/bi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobeAmericas } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { saveAs } from 'file-saver';
import { pdf, Page as PDFPage, Document as PDFDocument, Image as PDFImage, StyleSheet } from '@react-pdf/renderer';
import RenderPdf from './RenderPdf';
function Upload({ event, show, setShow }) {
  const [selectedFileCounts, setSelectedFileCounts] = useState({
    file: 0,
    image: 0,
    video: 0
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
 const [visible, setVisible] = useState(false); 
  const [description, setDescription] = useState("");
  const [topic,setTopic]=useState("");
  const [images, setImages] = useState([]);
  const [checkname,setCheckname]=useState("");
  const [message, setMessage] = useState('');
   const [accessToken, setAccessToken] = useState('');
   const[InputErrorList,setInputErrorList] = useState({});
   const {http} = AuthUser();
    const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setShow(false);
    window.location.href="/home";
  }
const handleImageChange = (e,fileType) => {
    const selectedImages = Array.from(e.target.files);
     setCheckname(fileType);
    setImages(selectedImages);

  };
  
  const handleSubmit = async (e) => {
  e.preventDefault();
   console.log('Selected files:', images);
  if (images.length === 0) {
    setMessage('No images selected.');
    return;
  }
  const formData = new FormData();
   if(checkname =="image"){
 images.forEach((image) => {
  formData.append('images[]', image);

});
   }
   if(checkname =="file")
   {
      console.log(checkname);
       images.forEach((image) => {
  formData.append('files[]', image);
});
   }
  if(checkname =="video")
   {
      console.log(checkname);
       images.forEach((image) => {
  formData.append('video[]', image);
});
   }
  formData.append('description', description);
  formData.append('topic', topic);
  formData.append('visible', visible.toString());
  try {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
 setLoading(true);
    const token = localStorage.getItem('token');
    http.post('/upload',formData,{
  headers: {
    'Content-Type': 'multipart/form-data',
    'X-CSRF-TOKEN': csrfToken
  }
}).then((res) => {
    setLoading(false);
    console.log(res.data.message);
    setMessage(res.data.message);
  }).catch((error) => {
    setLoading(false);
    console.log(error.response.data.message);
   if(error.response)
        {
         if(error.response.status === 422){
       setMessage(error.response.data.message);
         }
         if(error.response.status === 500){
           setMessage(error.response.message);
           
         }
        }
   
  });
    
  } catch (error) {
   
    console.error('Error uploading images:', error);
  }
};



   

  const handleFileChange = (event, fileType) => {
    const files = event.target.files;

    const fileCounts = {
      file: 0,
      image: 0,
      video: 0
    };
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (fileType === 'image' && file.type.startsWith('image/')) {
        fileCounts.image++;
      } else if (fileType === 'video' && file.type.startsWith('video/')) {
        fileCounts.video++;
      } else if (fileType === 'file') {
        fileCounts.file++;
      }
    }

    setSelectedFileCounts(fileCounts);
    setSelectedFiles(files);
    setSelectedFile(files[0]);
  };

  return (
        <Modal show={show}>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Select: {event}
                        <Form.Group controlId="custom-switch" className="d-flex justify-content-end">
                            <Form.Label><b>Visibility:</b></Form.Label>
                            <span className="mr-1">Public</span>
                            <Form.Check
                                type="switch"
                                id="custom-switch"
                                checked={visible}
                                onChange={(e) => setVisible(e.target.checked)}
                                label=""
                            />
                            <span className="ml-1">Private</span>
                        </Form.Group>
                    </div>
                    <input type="text" className="form-control"onChange={(e)=>setTopic(e.target.value)}placeholder='Topic'/>
                    <input
                        type="text"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={`Write Something about ${event}`}
                    />
                    <span className="text-danger">{InputErrorList.description}</span>
                    <label htmlFor="fileInput" className="custom-file-label">
                        {event === 'File' ? (
                            selectedFile
                                ? `${selectedFile.name} (${selectedFileCounts.file} selected)`
                                : `Choose a File (${selectedFileCounts.file} selected)`
                        ) : ''}
                        {event === 'Image' ? (
                            selectedFile
                                ? `${selectedFile.name} (${selectedFileCounts.image} selected)`
                                : `Choose an Image (${selectedFileCounts.image} selected)`
                        ) : ''}
                        {event === 'Video' ? (
                            selectedFile
                                ? `${selectedFile.name} (${selectedFileCounts.video} selected)`
                                : `Choose a Video (${selectedFileCounts.video} selected)`
                        ) : ''}
                    </label>
                    <input
                        type="file"
                        id="fileInput"
                        onChange={(e) => {
                            handleFileChange(e, event.toLowerCase());
                            handleImageChange(e, event.toLowerCase());
                        }}
                        multiple
                        style={{ display: 'none' }}
                    />
                    <span className="text-danger">{InputErrorList.file}</span>
                </Modal.Body>
                {message && <p>{message}</p>}
                <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? (
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                        ) : (
                            'Submit'
                        )}
                    </Button>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Button variant="secondary" onClick={handleClose} disabled={loading}>
                            Close
                        </Button>
                    </div>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};


const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#fff'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
    image: {
        width: '100%',
        height: 'auto'
    }
});

const TemplateCard = () => (
    <Card style={{ margin: "auto" }} className="col-md-8 col-md-offset-1">
        <Card.Header style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: "5%", height: "5%", borderRadius: "50%", backgroundColor: "#ccc" }} />
            <h4 style={{ paddingLeft: "10px", backgroundColor: "#ccc", width: "50%" }}>&nbsp;</h4>
        </Card.Header>
        <hr />
        <Card.Body>
            <div style={{ width: "100%", height: "200px", backgroundColor: "#eee" }} />
            <br />
            <h6 style={{ backgroundColor: "#eee", width: "30%" }}>&nbsp;</h6>
            <h6 style={{ position: "absolute", right: "0px", bottom: "17px", backgroundColor: "#eee", width: "30%" }}>&nbsp;</h6>
        </Card.Body>
    </Card>
);

function Home() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [userData, setUserData] = useState([]);
    const [showUploadOptions, setShowUploadOptions] = useState(false);
    const { http } = AuthUser();
    const [show, setShow] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        http.get('/fetchdata')
            .then((res) => {
                const data = res.data.data;
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

    const downloadFile = async (images) => {
        if (!images || !Array.isArray(images)) {
            console.error("Invalid images array:", images);
            return;
        }

        try {
            const MyDoc = (
                <PDFDocument>
                    {images.map((img, index) => (
                        <PDFPage key={index} style={styles.page}>
                            <PDFImage style={styles.image} src={`http://127.0.0.1:8000/images/${img.filename}`} />
                        </PDFPage>
                    ))}
                </PDFDocument>
            );

            const blob = await pdf(MyDoc).toBlob();
            saveAs(blob, 'images.pdf');
        } catch (error) {
            console.error("Error in downloadFile:", error);
        }
    };

    const handleUploadClick = () => {
        setShowUploadOptions(!showUploadOptions);
    };

    const handleEventSelection = (event) => {
        setSelectedEvent(event);
        setShow(true);
    };

    const handleFile = () => {
        setSelectedEvent('File');
        setShow(true);
        setShowUploadOptions(false);
    };

    const handleImage = () => {
        setSelectedEvent('Image');
        setShow(true);
        setShowUploadOptions(false);
    };

    const handleVideo = () => {        setSelectedEvent('Video');
        setShow(true);
        setShowUploadOptions(false);
    };

    const handleClose = () => setShow(false);

    return (
        <>
            <LoadingBar
                color='#f11946'
                progress={progress}
                onLoaderFinished={() => setProgress(0)} />

            <div className="postdesign" >
                {!loading ? userData.map((item, index) => (
                    <>
                    <Card key={index} style={{ margin: "auto" }} className=" col-md-6 col-md-offset-1">
                        <Card.Header style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Card.Img
                                    variant="bottom"
                                    src={"http://127.0.0.1:8000/avatar/" + item.avatar}
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
            
                            <Dropdown.Item onClick={() => handleDownload(item.id)}>
                                Download
                            </Dropdown.Item>
                            </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </Card.Header>
                        <h5>{item.topic.charAt(0).toUpperCase()+item.topic.slice(1)}</h5>
                        <hr />
                        <Card.Body>
                            {item.image && (
                                <>
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
                                    <br />
                                    <h6>Viewed: 1223</h6>
                                    <h6 style={{ position: "absolute", right: "0px", bottom: "17px" }}>Downloaded: 1223</h6>
                                </>
                            )}

                            {item.file && (
                                <>
                              
                               <RenderPdf url={`http://127.0.0.1:8000/api/files/${item.file}`} />
                                </>
                            )}
                        </Card.Body>
                    </Card>
                    <br/>
                    </>
                )) : (
                    Array.from({ length: 3 }).map((_, index) => (
                        <TemplateCard key={index} />
                    ))
                )}
            </div>

            {/* Floating Button */}
            <Button 
                variant="primary" 
                style={{ 
                    position: 'fixed', 
                    bottom: '20px', 
                    right: '20px', 
                    borderRadius: '50%', 
                    width: '60px', 
                    height: '60px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',  
                    backgroundColor: 'black' 
                }}
                onClick={handleUploadClick}
            >
                <BiPlus size={30} />
            </Button>

            {/* Upload Options */}
            {showUploadOptions && (
                <div style={{ 
                    position: 'fixed', 
                    bottom: '90px', 
                    right: '20px', 
                    backgroundColor: 'white', 
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', 
                    zIndex: 1000 
                }}>
                    <ul style={{ listStyleType: 'none', margin: 0, padding: '10px' }}>
                        <li style={{ padding: '10px', cursor: 'pointer' }} onClick={handleFile}>Upload File</li>
                        {/* <li style={{ padding: '10px', cursor: 'pointer' }} onClick={handleImage}>Upload Image</li>
                        <li style={{ padding: '10px', cursor: 'pointer' }} onClick={handleVideo}>Upload Video</li> */}
                    </ul>
                </div>
            )}

            <Upload event={selectedEvent} show={show} setShow={setShow} handleEventSelection={handleEventSelection} />
    
        </>
    );
}

export default Home;
