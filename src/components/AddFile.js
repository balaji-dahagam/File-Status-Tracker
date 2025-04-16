import React, { useState } from "react";
import Navbar from "./Navbar";

const AddFile = () => {
  const [terms, setterms] = useState({
    fileName: "",
    fileType: "",
    status: "",
    currentLocation: "",
    comments: "",
    threshold: null,
    toEmail: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5500/api/file/submitfile",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(terms),
        }
      );
      const json = await response.json();
      if (response.status === 201) {
        console.log("File submitted successfully");
      } else {
        console.log("error submitting file");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const value =
      e.target.name === "threshold" ? parseInt(e.target.value) : e.target.value;
    setterms({ ...terms, [e.target.name]: value });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5 pt-4">
        {/* Logo */}
        <div className="d-flex justify-content-center align-items-center">
          <img
            src="https://www.iiitg.ac.in/uploads/2023/08/01/7cb707d8dc0de4a798b10636d76db56c.png"
            className="img-fluid my-3"
            width="600px"
            height="auto"
            alt="IIITG Logo"
          />
        </div>

        {/* Form Container */}
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "70vh" }}
        >
          <div className="col-lg-6 col-md-8 col-sm-10">
            <form onSubmit={handleSubmit}>
              {/* File Name and File Type in one row */}
              <div className="row mb-3">
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="fileName"
                      placeholder="File Name"
                      name="fileName"
                      onChange={handleChange}
                      value={terms.fileName}
                    />
                    <label htmlFor="fileName">File Name</label>
                  </div>
                </div>
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="fileType"
                      placeholder="File Type"
                      name="fileType"
                      onChange={handleChange}
                      value={terms.fileType}
                    />
                    <label htmlFor="fileType">File Type</label>
                  </div>
                </div>
              </div>

              {/* Status input */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="status"
                  placeholder="Status"
                  name="status"
                  onChange={handleChange}
                  value={terms.status}
                />
                <label htmlFor="status">Status</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="threshold"
                  placeholder="Threshold (days)"
                  name="threshold"
                  onChange={handleChange}
                  value={terms.threshold || ""}
                />
                <label htmlFor="threshold">Threshold (days)</label>
              </div>

              {/* Comments input */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="comments"
                  placeholder="Comments"
                  name="comments"
                  onChange={handleChange}
                  value={terms.comments}
                />
                <label htmlFor="comments">Comments (if any)</label>
              </div>

              {/* Forward To input */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="toEmail"
                  placeholder="Forward To"
                  name="toEmail"
                  onChange={handleChange}
                  value={terms.toEmail}
                />
                <label htmlFor="toEmail">Forward to</label>
              </div>

              {/* Submit Button */}
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary my-3">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddFile;
