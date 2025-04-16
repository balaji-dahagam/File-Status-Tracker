import React, { useState, useEffect } from "react";
import userIcon from "./user.png";
import IIITGIcon from "./iiitg.jpg";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  let navigate = useNavigate();
  const [dropdown, setDropdown] = useState(false);
  const [loggedinemail, setLoggedinemail] = useState(null);
  const [loggedin, setLoggedin] = useState(localStorage.getItem("loggedin"));

  const handleLogout = () => {
    setLoggedin(false);
    setLoggedinemail(null);
    setDropdown(false);
    localStorage.removeItem("loggedin");
    navigate("/", { replace: true });
  };

  const handleIconClick = () => {
    if (loggedin) {
      setDropdown((prevState) => !prevState);
    }
  };

  useEffect(() => {
    const email = localStorage.getItem("loggedinemail");
    setLoggedinemail(email);
  }, []);

  return (
    <nav
      style={{
        display: "flex",
        height: "10vh",
        width: "100%",
        backgroundColor: "white",
        justifyContent: "space-around",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "95%",
          color: "#003875",
          fontWeight: "550",
          fontSize: "3vh",
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ display: "flex", gap: "1.5vw" }}>
          <img
            src={IIITGIcon}
            style={{ height: "5vh", cursor: "pointer" }}
            alt="IIITG Icon"
            onClick={() => navigate("/")}
          />
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (loggedin) {
                navigate("/addfile");
              }
            }}
          >
            Add a file
          </span>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (loggedin) {
                navigate("/files");
              }
            }}
          >
            Your Files
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
          {!loggedin ? (
            <button
              style={{
                borderWidth: "1px",
                color: "white",
                borderRadius: "1.5vh",
                backgroundColor: "#003875",
                height: "5vh",
                width: "5vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "2vh",
                cursor: "pointer",
              }}
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
          ) : (
            <div onClick={handleIconClick} style={{ cursor: "pointer" }}>
              <img src={userIcon} alt="User Icon" style={{ height: "5vh" }} />
            </div>
          )}

          {dropdown && loggedin && (
            <div
              style={{
                position: "absolute",
                top: "8vh",
                right: "0vw",
                backgroundColor: "white",
                border: "1px solid #ddd",
                borderRadius: "6px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                zIndex: 100,
                width: "120px",
              }}
            >
              <div
                style={{
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
                onClick={() => {
                  setDropdown(false);
                  navigate("/profile");
                }}
              >
                Profile
              </div>
              {loggedinemail === "Admin@iiitg.ac.in" && (
                <div
                  style={{
                    padding: "6px 10px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                  onClick={() => {
                    setDropdown(false);
                    navigate("/signup");
                  }}
                >
                  Add an account
                </div>
              )}
              <div
                style={{
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
                onClick={() => {
                  setDropdown(false);
                  navigate("/updatepassword");
                }}
              >
                Change Password
              </div>
              <div
                style={{
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
                onClick={handleLogout}
              >
                Log Out
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
