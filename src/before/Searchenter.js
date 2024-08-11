import React, { useState, useEffect } from "react";
import { useParams, Link,useNavigate } from "react-router-dom";
import axios from "axios";
import Pagepdf from "../dasboard/Pagepdf";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";  
import "bootstrap/dist/css/bootstrap.min.css"; 
 
const SearchEnter = () => {
  const { searchTerm } = useParams(); // Get searchTerm from URL parameters
  const [data, setData] = useState([]); // State to store fetched data
  const [error, setError] = useState(null); // State to store any errors
  const [loading, setLoading] = useState(true); // State for loading
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const itemsPerPage = 10; // Number of items per page
const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/fetchsearchdata/${searchTerm}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer your-token",
            },
          }
        );
        setData(res.data); // Update state with fetched data
        console.log(res.data);
      } catch (error) {
        setError("Error loading data"); // Set error message
        console.error("Error loading data", error);
      } finally {
        setLoading(false); // Set loading to false when fetching ends
      }
    };

    fetchData(); // Call fetchData on component mount

    return () => {
      setData([]); // Cleanup function to reset data when component unmounts
    };
  }, [searchTerm]); // Re-run effect if searchTerm changes

  // Calculate current items to display based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container" >
      <h3>Results for: {searchTerm}</h3>
      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <p>{error}</p> // Display error if it exists
      ) : (
        <div className="row">
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <div
                key={index}
                className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-right mb-2"
              >
                <Card
                  className="custom-card"
                  style={{
                    width: "200px",
                    minWidth: "200px",
                    height: "300px",
                  }} // Fixed size
                >
                  <div
                    className="pdf-preview"
                      >
                    <Pagepdf
                      url={`http://127.0.0.1:8000/api/files/${item.file}`}
                    />
                    <p className="designPdf">PDF</p>
                  </div>
                  <Card.Body
                    className="d-flex flex-column justify-content-between"
                    style={{ overflow: "auto" }}
                  >
                    <div>
                      <Card.Title>{item.topic}</Card.Title>
                      <Card.Text
                        className="nav-link text-left"
                        as={Link}
                        to={`/viewdetail/${item.id}`}
                      >
                        <b style={{ fontSize: "12px" }}>
                          Added By {item.firstname} ...
                        </b>
                      </Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <p>No results found.</p> // Message when no data is found
          )}
        </div>
      )}
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={data.length}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

// Pagination Component
const Pagination = ({
  itemsPerPage,
  totalItems,
  currentPage,
  onPageChange,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination justify-content-center">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${number === currentPage ? "active" : ""}`}
          >
            <button onClick={() => onPageChange(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SearchEnter;
