import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";

const Signup = () => {
  const [select, setselect] = useState("0");
  const [credentials, setcredentials] = useState({
    name: "",
    rollno: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [error, setError] = useState("");

  const handleRoleChange = (e) => {
    setselect(e.target.value);
    if (select === "1") {
      setcredentials({
        name: "",
        rollno: "",
        email: "",
        password: "",
        cpassoword: "",
      });
    } else {
      setcredentials({ name: "", email: "", password: "", cpassoword: "" });
    }
    setError("");
  };

  let navigate = useNavigate();
  function useWidthStyle() {
    const [widthStyle, setWidthStyle] = useState(
      window.innerWidth >= 1024 ? "25vw" : "75vw"
    );

    useEffect(() => {
      const handleResize = () => {
        setWidthStyle(window.innerWidth >= 1024 ? "25vw" : "75vw");
      };

      window.addEventListener("resize", handleResize);

      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    return widthStyle;
  }
  const widthStyle = useWidthStyle();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (credentials.password !== credentials.cpassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    let endpoint = "";
    let requestBody = {};
    switch (select) {
      case "1":
        endpoint = "http://localhost:5500/api/authStudent/createstudent";
        requestBody = {
          name: credentials.name,
          rollno: credentials.rollno,
          email: credentials.email,
          password: credentials.password,
        };
        break;

      case "2":
        endpoint = "http://localhost:5500/api/authFaculty/createfaculty";
        requestBody = {
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
        };
        break;

      case "3":
        endpoint =
          "http://localhost:5500/api/authAdministrator/createadministrator";
        requestBody = {
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
        };
        break;
      default:
        console.log("Invalid role selected");
        return;
    }
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      //redirect
      console.log("success");
      const token = JSON.stringify(json.authToken);
      localStorage.setItem("token", token);
      // props.showAlert("Logged in successfully ", "success");
      navigate("/");
      return;
    } else {
      // props.showAlert("Invalid credentials", "danger");
      if (json.error[0].msg === "Internal server error") {
        setError("A student with this roll number already has an account !");
      } else {
        setError(json.error[0].msg);
      }
    }
  };

  const handleChange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <>
      <Navbar />
      <div>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "35vh" }}
        >
          <img
            src="https://www.iiitg.ac.in/uploads/2023/08/01/7cb707d8dc0de4a798b10636d76db56c.png"
            className="img-fluid"
            width="548px"
            height="70px"
            alt=""
          />
        </div>

        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "80vh" }}
        >
          <div style={{ width: widthStyle }}>
            <form onSubmit={handleSubmit}>
              <select
                className="form-select my-3"
                style={{ height: "60px" }}
                aria-label="Default select example"
                onChange={handleRoleChange}
              >
                <option value="0" selected>
                  Select your role
                </option>
                <option value="1">Student</option>
                <option value="2">Faculty</option>
                <option value="3">Administrator</option>
              </select>
              <div style={{ width: widthStyle }} className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="name@example.com"
                  name="name"
                  onChange={handleChange}
                  value={credentials.name}
                  required
                />
                <label htmlFor="name">Name</label>
              </div>
              {select === "1" && (
                <div
                  style={{ width: widthStyle }}
                  className="form-floating mb-3"
                >
                  <input
                    type="text"
                    className="form-control"
                    id="rollno"
                    placeholder="name@example.com"
                    name="rollno"
                    onChange={handleChange}
                    value={credentials.rollno}
                    required
                  />
                  <label htmlFor="email">Roll number</label>
                </div>
              )}
              <div style={{ width: widthStyle }} className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="name@example.com"
                  name="email"
                  onChange={handleChange}
                  value={credentials.email}
                />
                <label htmlFor="email">Email</label>
              </div>
              <div style={{ width: widthStyle }} className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                  value={credentials.password}
                />
                <label htmlFor="password">Password</label>
              </div>
              <div style={{ width: widthStyle }} className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="cpassword"
                  placeholder="Password"
                  name="cpassword"
                  onChange={handleChange}
                  value={credentials.cpassword}
                />
                <label htmlFor="cpassword">Confirm Password</label>
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <div className="d-flex justify-content-center align-items-center">
                <button type="submit" className="btn btn-primary ">
                  Sign up
                </button>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <p className="my-3">
                  <Link to="/login">Continue to Login</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
