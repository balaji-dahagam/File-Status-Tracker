import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const File = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [endpoint, setEndpoint] = useState("");

  const handleViewDetails = (file) => {
    // Navigate to file details or handle view details here
    navigate("/filedetails", { state: { file } });
  };

  // Set the endpoint based on role on the initial render
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "administrator") {
      setEndpoint("http://localhost:5500/api/file/admin/files");
    } else {
      setEndpoint("http://localhost:5500/api/file/showfiles");
    }
  }, []);

  // Fetch the files based on the endpoint
  useEffect(() => {
    if (!endpoint) return; // Only fetch files if the endpoint is set

    const fetchFiles = async () => {
      try {
        const response = await fetch(endpoint, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (data.success) {
          setFiles(data.files);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, [endpoint]); // Re-run only if `endpoint` changes

  return (
    <>
      <Navbar />
      <div
        className="d-flex flex-column align-items-center"
        style={{ marginTop: "80px" }}
      >
        {files.length === 0 ? (
          <p>No files available</p> // Display message if no files
        ) : (
          files.map((file, index) => (
            <div key={index} className="card w-75 mb-3">
              <div className="card-body">
                <h5 className="card-title">{file.fileName}</h5>
                <p className="card-text">{file.fileType}</p>
                <button
                  onClick={() => handleViewDetails(file)}
                  className="btn btn-primary"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default File;
