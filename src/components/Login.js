import { useState, useEffect } from "react";
import React from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [credentials, setcredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [select, setselect] = useState("0");
  const [role, setrole] = useState(null);
  const [endpoint, setEndpoint] = useState("");

  let navigate = useNavigate();

  // Handle role change
  const handleRoleChange = (e) => {
    setselect(e.target.value);
    setError("");
  };

  // Effect to set role and endpoint based on select value
  useEffect(() => {
    if (select === "1") {
      setrole("student");
      setEndpoint("http://localhost:5500/api/authStudent/studentlogin");
    } else if (select === "2") {
      setrole("faculty");
      setEndpoint("http://localhost:5500/api/authFaculty/facultylogin");
    } else if (select === "3") {
      setrole("administrator");
      setEndpoint(
        "http://localhost:5500/api/authAdministrator/administratorlogin"
      );
    } else {
      setrole(null);
      setEndpoint(""); // Clear endpoint if no role is selected
    }
  }, [select]); // Only run when select changes

  // Check if the user is already logged in
  useEffect(() => {
    const loggedin = localStorage.getItem("loggedin");
    if (loggedin) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
      credentials: "include",
    });

    const json = await response.json();
    // console.log(json);

    if (json.success) {
      setcredentials({
        email: "",
        password: "",
      });
      localStorage.setItem("loggedinemail", credentials.email);
      sessionStorage.setItem("role", role);
      localStorage.setItem("loggedin", true);
      // console.log(localStorage.getItem("token"));
      navigate("/");
    } else {
      setError(json.error[0].msg);
    }
  };

  const handleForgotPass = async () => {
    // Validate email input
    if (!credentials.email) {
      setError("Please enter email to continue");
      return; // Exit the function if email is not provided
    }

    try {
      console.log("oy unnava");
      const response = await fetch("http://localhost:5500/api/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: credentials.email }),
      });

      // Log the response for debugging
      console.log("Response Status:", response.status);
      const json = await response.json();

      // Log the received JSON for better understanding
      console.log("Response JSON:", json);

      // Check if the response is okay
      if (response.ok) {
        localStorage.setItem("mail", credentials.email);
        console.log(
          "Email stored in localStorage:",
          localStorage.getItem("mail")
        );
        navigate("/otp");
      } else {
        // Handle errors based on the server response
        const errorMessage = json.error
          ? Array.isArray(json.error)
            ? json.error[0].msg
            : JSON.stringify(json.error)
          : "An error occurred. Please try again.";
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error:", error); // Log the error for debugging
      setError("Internal server error");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Handle responsive styles
  function useWidthStyle() {
    const [widthStyle, setWidthStyle] = useState(
      window.innerWidth >= 1024 ? "25vw" : "75vw"
    );

    useEffect(() => {
      const handleResize = () => {
        setWidthStyle(window.innerWidth >= 1024 ? "25vw" : "50vw");
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

  return (
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
        <div style={{ width: widthStyle }}>
          <form onSubmit={handleSubmit}>
            <select
              className="form-select my-3"
              style={{ height: "60px" }}
              aria-label="Default select example"
              onChange={handleRoleChange}
              value={select} // Ensure the value is bound to the state
            >
              <option value="0">Select your role</option>
              <option value="1">Student</option>
              <option value="2">Faculty</option>
              <option value="3">Administrator</option>
            </select>
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
              <label htmlFor="email">Email address</label>
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
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="d-flex justify-content-center align-items-center ">
              <button type="submit" className="btn btn-primary my-3">
                Login
              </button>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <p className="my-3">
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    handleForgotPass();
                  }}
                  to="#"
                >
                  Forgot password
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
