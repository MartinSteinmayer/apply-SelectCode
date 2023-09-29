import { Sidebar } from "./components/Sidebar";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Tasks } from "./pages/Tasks";
import { Projects } from "./pages/Projects";
import { NotFound } from "./pages/NotFound";
import { Profile } from "./pages/Profile";
import { ProjectPage } from "./pages/ProjectPage";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { VerifyEmail } from "./pages/VerifyEmail";


function App() {

  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/verify-email' element={<VerifyEmail/>} />
        <Route path='/projects' element={<Projects/>} />
        <Route path='/tasks' element={<Tasks/>} />
        <Route path='/profile' element={<Profile/>} />
        <Route path="/projects/:projectId" element={<ProjectPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
