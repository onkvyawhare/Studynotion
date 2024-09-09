import Home from './pages/Home';
import './App.css';
import { Route,Routes } from 'react-router-dom';
import Navbar from './components/Common/Navbar';
import OpenRoute from "./components/core/Auth/OpenRoute"
import Catalog from "./pages/Catalog"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import CourseDetails from './pages/CourseDetails';
// import ForgotPassword from "./pages/ForgotPassword";
// import UpdatePassword from "./pages/UpdatePassword";


function App() {
  return (
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>
     <Navbar/>
     <Routes>
     
      <Route path='/' element={<Home/>}/>
      
       <Route path="catalog/:catalogName" element={<Catalog/>} />
       <Route path="courses/:courseId" element={<CourseDetails/>} /> 
       
      <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
    <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
     </Routes>
    </div>
  );
}

export default App;
