import "./App.css";
import Login from "./components/Login";
import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Otp from "./components/Otp";
import Error from "./components/Error";
import ChangePassword from "./components/ChangePassword";
import Profile from "./components/Profile";
import ForgotPassword from "./components/ForgotPassword";
import AddFile from "./components/AddFile";
import File from "./components/File";
import FileDetails from "./components/FileDetails";

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/forgotpass" element={<ForgotPassword />}></Route>
          <Route exact path="/signup" element={<Signup />}></Route>
          <Route exact path="/otp" element={<Otp />}></Route>
          <Route exact path="/addfile" element={<AddFile />}></Route>
          <Route exact path="/files" element={<File />}></Route>
          <Route
            exact
            path="/updatepassword"
            element={<ChangePassword />}
          ></Route>
          <Route exact path="/profile" element={<Profile />}></Route>
          <Route exact path="/filedetails" element={<FileDetails />}></Route>
          <Route exact path="/error" element={<Error />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
