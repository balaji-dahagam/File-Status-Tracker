import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const FileDetails = () => {
  const location = useLocation();
  const { file } = location.state;
  const [status, setStatus] = useState(file.status);
  const [lastUpdated, setLastUpdated] = useState(file.lastUpdated);
  const [history, setHistory] = useState(file.history || []);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const role = sessionStorage.getItem("role");

  const fetchFileDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:5500/api/file/details/${file._id}`, // Adjust endpoint as necessary
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setStatus(data.file.status);
        setHistory(data.file.history);
        setLastUpdated(data.file.lastUpdated);
      } else {
        console.error("Error fetching file details:", data.error);
      }
    } catch (error) {
      console.error("Error fetching file details:", error.message);
    }
  };

  // Call fetchFileDetails when component mounts
  useEffect(() => {
    fetchFileDetails();
  }, []);

  // Update file details with fetch
  const handleUpdateFileDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:5500/api/file/updatefiledetails/${file._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipientEmail,
            status: newStatus,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        fetchFileDetails();
        setShowModal(false);
      } else {
        console.error("Error updating file:", data.error || data.msg);
      }
    } catch (error) {
      console.error("Error updating file:", error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5 pt-5">
        <h2>File Details</h2>
        <p>
          <strong>Status:</strong> {status}
        </p>
        <p>
          <strong>Last Updated:</strong>{" "}
          {new Date(lastUpdated).toLocaleString()}
        </p>

        <h3>History</h3>
        <div className="accordion" id="historyAccordion">
          {history.map((entry, index) => (
            <div key={index} className="accordion-item">
              <h2 className="accordion-header" id={`heading-${index}`}>
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${index}`}
                  aria-expanded="false"
                  aria-controls={`collapse-${index}`}
                >
                  {new Date(entry.updatedAt).toLocaleString()}
                </button>
              </h2>
              <div
                id={`collapse-${index}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading-${index}`}
                data-bs-parent="#historyAccordion"
              >
                <div className="accordion-body">
                  <p>
                    <strong>From:</strong> {entry.fromEmail}
                  </p>
                  <p>
                    <strong>To:</strong> {entry.toEmail}
                  </p>
                  <p>
                    <strong>Status:</strong> {entry.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {role === "administrator" && (
          <>
            <button className="btn btn-primary mt-3" onClick={handleShowModal}>
              Update and Forward
            </button>

            {showModal && (
              <div className="modal show d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Update File Details</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={handleCloseModal}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label htmlFor="recipientEmail" className="form-label">
                          Recipient Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="recipientEmail"
                          value={recipientEmail}
                          onChange={(e) => setRecipientEmail(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="newStatus" className="form-label">
                          Status
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="newStatus"
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCloseModal}
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleUpdateFileDetails}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default FileDetails;
