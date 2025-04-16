import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const File = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [endpoint, setEndpoint] = useState("");
  const [select, setselect] = useState("0");

  const handleViewDetails = (file) => {
    navigate("/filedetails", { state: { file } });
  };

  const handleDeleteFile = async (file) => {
    // Remove the file from the UI immediately
    const updatedFiles = files.filter((f) => f._id !== file._id);
    setFiles(updatedFiles);

    try {
      // Send DELETE request to the backend
      const response = await fetch(
        `http://localhost:5500/api/file/delete/${file._id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      // If the delete fails, log the error (no UI change)
      if (!data.success) {
        console.error("Delete failed: ", data.error);
      }
    } catch (error) {
      // If there's a network error, log it (no UI change)
      console.error("Error deleting file:", error);
    }
  };

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (role === "administrator") {
      if (select === "1") {
        setEndpoint("http://localhost:5500/api/file/admin/files/received");
      } else if (select === "2") {
        setEndpoint("http://localhost:5500/api/file/admin/files/sent");
      }
    } else {
      setEndpoint("http://localhost:5500/api/file/showfiles");
    }
  }, [select]);

  useEffect(() => {
    if (!endpoint) return;

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
  }, [endpoint]);

  const handleRoleChange = (e) => {
    setselect(e.target.value);
    sessionStorage.setItem("select", e.target.value);
  };

  return (
    <>
      <Navbar />
      {sessionStorage.getItem("role") === "administrator" && (
        <div className="container-fluid mt-5 pt-5 d-flex justify-content-center">
          <select
            className="form-select my-3"
            style={{ height: "50px", width: "200px" }}
            aria-label="Default select example"
            onChange={handleRoleChange}
            value={select}
          >
            <option value="0">Select an option</option>
            <option value="1">Received Files</option>
            <option value="2">Sent Files</option>
          </select>
        </div>
      )}
      <div
        className="container-fluid mt-5 "
        style={{ padding: "20px 50px", maxWidth: "1200px" }}
      >
        {files.length === 0 ? (
          <p className="text-center mt-5">No files available</p>
        ) : (
          <ul className="list-group w-100">
            <li className="list-group-item list-group-item-dark d-flex">
              <div className="col-2 px-2">
                <strong>File Name</strong>
              </div>
              <div className="col-2 px-2">
                <strong>File Type</strong>
              </div>
              <div className="col-3 px-2">
                <strong>Submitted At</strong>
              </div>
              <div className="col-3 px-2">
                <strong>Last Updated</strong>
              </div>
              <div className="col-2 px-2 text-center">
                <strong>Action</strong>
              </div>
            </li>
            {files.map((file, index) => (
              <li
                key={index}
                className="list-group-item d-flex align-items-center"
              >
                <div className="col-2 px-2">{file.fileName}</div>
                <div className="col-2 px-2">{file.fileType}</div>
                <div className="col-3 px-2">
                  {file.submissionDate
                    ? new Date(file.submissionDate).toLocaleString()
                    : "N/A"}
                </div>
                <div className="col-3 px-2">
                  {file.lastUpdated
                    ? new Date(file.lastUpdated).toLocaleString()
                    : "N/A"}
                </div>
                <div className="col-2 text-center">
                  <button
                    onClick={() => handleViewDetails(file)}
                    className="btn btn-primary btn-sm"
                  >
                    View Details
                  </button>
                </div>
                <div className="col-1 text-center">
                  <i
                    className="fa-solid fa-trash"
                    onClick={() => handleDeleteFile(file)}
                    style={{ cursor: "pointer", marginLeft: "-10px" }}
                  ></i>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default File;
