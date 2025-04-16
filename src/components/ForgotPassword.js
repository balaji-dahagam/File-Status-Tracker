import React, { useState } from "react";
import Navbar from "./Navbar";

const ForgotPassword = () => {
  const [terms, setterms] = useState({
    email: localStorage.getItem("mail"),
    newpassword: "",
    cnewpassword: "",
  });
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (terms.newpassword !== terms.cnewpassword) {
      setError("Passwords do not match");
      return;
    }
    const response = await fetch("http://localhost:5500/api/forgotpassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: terms.email,
        newpassword: terms.newpassword,
      }),
    });
    if (response.ok) {
      setError("Password updated successfully");
    } else {
      const errorData = await response.json();
      console.log("Error:", errorData);
      setError("Error occured");
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

export default ForgotPassword;
