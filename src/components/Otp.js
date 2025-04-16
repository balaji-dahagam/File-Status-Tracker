import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Otp = () => {
  const [terms, setterms] = useState({
    email: localStorage.getItem("mail"),
    otp: "",
  });
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(terms);
    const response = await fetch("http://localhost:5500/api/verifyotp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: terms.email,
        otp: terms.otp,
      }),
    });
    if (response.ok) {
      console.log("otp veried successfully");
      navigate("/forgotpass");
    } else {
      // console.log("error");
      // console.log(response);
      const errorData = await response.json();
      console.log("Error:", errorData);
    }
  };

  const handleChange = (e) => {
    setterms({ ...terms, [e.target.name]: e.target.value });
  };
  return (
    <>
      <div>
        <div className="d-flex justify-content-center align-items-center">
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
          <form onSubmit={handleSubmit}>
            {/* <div className="form-floating mb-3" style={{ width: "25vw" }}>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Password"
                name="email"
                // onChange={handleChange}
                // value={credentials.password}
              />
              <label htmlFor="email">Email</label>
            </div> */}
            <div className="form-floating mb-3" style={{ width: "25vw" }}>
              <input
                type="text"
                className="form-control"
                id="otp"
                placeholder="Password"
                name="otp"
                onChange={handleChange}
                value={terms.otp}
              />
              <label htmlFor="otp">OTP</label>
            </div>
            <div className="d-flex justify-content-center align-items-center ">
              <button type="submit" className="btn btn-primary my-3">
                Verify and continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Otp;
