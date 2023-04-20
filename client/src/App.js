import Header from './components/header';
import Post from './components/post'
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import { UserContextProvier } from './userContext';
import CreatePost from './pages/createPost';
import PostPage from './pages/PostPage';
import EditPost from './pages/editPost';

function App() {
  return (
    <UserContextProvier>
    <Routes>  
         <Route path="/" element={<Layout/>}>  
         <Route index element={<Home/>}/>
         <Route path="/login" element={<LoginPage/>}/>
         <Route path="/register" element={<RegisterPage/>}/>
         <Route path="/create" element={<CreatePost/>}/>
         <Route path="/post/:id" element={<PostPage/>} />
         <Route path='edit/:id' element={<EditPost/>}/>
         </Route>
    </Routes>
    </UserContextProvier> 
  );
}

export default App;
