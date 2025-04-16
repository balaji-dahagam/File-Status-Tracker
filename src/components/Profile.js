import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

const Profile = () => {
  const [endpoint, setEndpoint] = useState("");
  const [terms, setTerms] = useState({
    name: "",
    role: localStorage.getItem("role"),
    rollno: "",
    email: "",
  });

  const [error, setError] = useState(null);

  // Set the API endpoint based on the role
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "student") {
      setEndpoint("http://localhost:5500/api/authStudent/getstudent");
    } else if (role === "faculty") {
      setEndpoint("http://localhost:5500/api/authFaculty/getfaculty");
    } else if (role === "administrator") {
      setEndpoint(
        "http://localhost:5500/api/authAdministrator/getadministrator"
      );
    } else {
      setEndpoint(""); // Clear endpoint if no role is selected
    }
  }, []);

  // Fetch the user details when the endpoint is set
  useEffect(() => {
    const fetchDetails = async () => {
      if (!endpoint) return; // Do not fetch if endpoint is empty

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (response.ok) {
          // Update the terms with fetched data
          setTerms((prevState) => ({
            ...prevState,
            name: data.name,
            rollno: data.rollno || "", // Some roles may not have roll numbers
            email: data.email,
          }));
        } else {
          setError(data.error[0].msg || "Failed to fetch details");
        }
      } catch (error) {
        console.log("Error fetching user details:", error);
        setError("Internal server error");
      }
    };

    fetchDetails();
  }, [endpoint]); // Fetch details only when the endpoint changes

  return (
    <>
      <Navbar />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "33vh" }}
      >
        <img
          src="https://www.iiitg.ac.in/uploads/2023/08/01/7cb707d8dc0de4a798b10636d76db56c.png"
          className="img-fluid my-3"
          width="548px"
          height="70px"
          alt="IIIT Guwahati"
        />
      </div>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "25vh" }}
      >
        <h1>Your Details</h1>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        {error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <div className="card" style={{ width: "40rem" }}>
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-around">
                <div
                  style={{
                    width: "50%",
                    textAlign: "left",
                    paddingRight: "10px",
                  }}
                >
                  Name
                </div>
                <div
                  style={{
                    width: "50%",
                    textAlign: "left",
                    paddingLeft: "10px",
                  }}
                >
                  {terms.name}
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-around">
                <div
                  style={{
                    width: "50%",
                    textAlign: "left",
                    paddingRight: "10px",
                  }}
                >
                  Role
                </div>
                <div
                  style={{
                    width: "50%",
                    textAlign: "left",
                    paddingLeft: "10px",
                  }}
                >
                  {terms.role}
                </div>
              </li>
              {/* Roll Number is only shown for students */}
              {terms.role === "student" && (
                <li className="list-group-item d-flex justify-content-around">
                  <div
                    style={{
                      width: "50%",
                      textAlign: "left",
                      paddingRight: "10px",
                    }}
                  >
                    Roll Number
                  </div>
                  <div
                    style={{
                      width: "50%",
                      textAlign: "left",
                      paddingLeft: "10px",
                    }}
                  >
                    {terms.rollno}
                  </div>
                </li>
              )}
              <li className="list-group-item d-flex justify-content-around">
                <div
                  style={{
                    width: "50%",
                    textAlign: "left",
                    paddingRight: "10px",
                  }}
                >
                  Registered Email
                </div>
                <div
                  style={{
                    width: "50%",
                    textAlign: "left",
                    paddingLeft: "10px",
                  }}
                >
                  {terms.email}
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
