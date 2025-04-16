import React, { useState } from "react";
import Navbar from "./Navbar";

const ChangePassword = () => {
  const [terms, setterms] = useState({
    oldpassword: "",
    newpassword: "",
    cnewpassword: "",
  });
  const [error, setError] = useState("");
  let endpoint = "";
  const role = localStorage.getItem("role");
  // console.log(role);
  // console.log(localStorage.getItem("role"));
  if (role === "student") {
    endpoint = "http://localhost:5500/api/authStudent/schangepassword";
  }
  if (role === "faculty") {
    endpoint = "http://localhost:5500/api/authFaculty/fchangepassword";
  }
  if (role === "administrator") {
    endpoint = "http://localhost:5500/api/authAdministrator/achangepassword";
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(localStorage.getItem("token"));
    const response = await fetch(endpoint, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldpassword: terms.oldpassword,
        newpassword: terms.newpassword,
      }),
    });
    const json = await response.json();
    if (json.success) {
      setError("Password updated successfully");
    } else {
      // console.log(json.error[0].error);
      setError("Something went wrong");
    }
  };
  const handleChange = (e) => {
    setterms({ ...terms, [e.target.name]: e.target.value });
  };
  return (
    <>
      <Navbar />
      <div style={{ height: "40vh" }}>
        <div
          className="d-flex justify-content-center align-items-center "
          style={{ height: "30vh" }}
        >
          <img
            src="https://www.iiitg.ac.in/uploads/2023/08/01/7cb707d8dc0de4a798b10636d76db56c.png"
            className="img-fluid my-3"
            width="548px"
            height="70px"
            alt=""
          />
        </div>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "80vh" }}
        >
          <div>
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="oldpassword"
                  placeholder="Password"
                  name="oldpassword"
                  onChange={handleChange}
                  value={terms.oldpassword}
                />
                <label htmlFor="oldpassword">Current Password</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="newpassword"
                  placeholder="Password"
                  name="newpassword"
                  onChange={handleChange}
                  value={terms.newpassword}
                />
                <label htmlFor="newpassword">New Password</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="cnewpassword"
                  placeholder="Password"
                  name="cnewpassword"
                  onChange={handleChange}
                  value={terms.cnewpassword}
                />
                <label htmlFor="cnewpassword">Confirm New Password</label>
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <div className="d-flex justify-content-center align-items-center ">
                <button type="submit" className="btn btn-primary my-3">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
