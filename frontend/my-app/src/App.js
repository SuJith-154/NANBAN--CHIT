import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import Admin from './pages/Admin';
import UserPage from './pages/UserPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path="/user/:name" element={<UserPage />} /> 
        <Route path='/Admin' element={<Admin />} />
      </Routes>
    </Router>
  );
}

 export default App;

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './Login';
// import UserPage from './UserPage'; // ✅ Make sure the import is correct

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/user/:name" element={<UserPage />} /> {/* ✅ THIS is the key */}
//         {/* Add other routes here, like /admin if needed */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;
