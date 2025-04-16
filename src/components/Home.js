import React, { useEffect } from "react";
import backgroundImage from "./background.jpg";
import collegeImage from "./college.webp";
import Navbar from "./Navbar";

const Home = () => {
  useEffect(() => {
    document.body.style.backgroundImage = `url(${backgroundImage})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";

    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);

  return (
    <>
      <Navbar />
      <div
        style={{
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "90vh",
          fontSize: "24px",
          marginTop: "0vh",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100vw",
            flexDirection: "row",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "20vh",
              color: "#003875",
              fontSize: "4rem",
              display: "flex",
              justifyContent: "flex-start",
              flexDirection: "column",
              marginBottom: "5rem",
            }}
          >
            <p style={{ margin: "0", textAlign: "left" }}>File Tracking</p>
            <p
              style={{
                margin: "0",
                textAlign: "left",
                marginTop: "0.2rem",
              }}
            >
              System
            </p>
          </div>
          <div
            className="image-container"
            style={{
              width: "50%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <img
              src={collegeImage}
              style={{
                width: "120%",
              }}
            />
          </div>
        </div>
      </div>

      <style>
        {`
          @media (max-width: 576px) {
            div[style*="flex-direction: row"] {
              flex-direction: column !important;
            }

            div[style*="width: 50%"] {
              display: none !important;
            }

            img {
              display: none !important;
            }

            p {
              font-size: 3rem !important;
            }

            div[style*="height: 20vh"] {
              margin-bottom: 8rem !important;
              margin-top: -8rem !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default Home;
