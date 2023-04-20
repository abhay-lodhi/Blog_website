import { Link } from "react-router-dom"
import styles from "../styles/header.module.css"
import { useContext, useEffect, useState } from "react"
import { userContext } from "../userContext";
 
export default function Header() {

    //const [username,setUsername]=useState(null);
    
    const {setUserInfo, userInfo}=useContext(userContext);

    const username=userInfo?.username;

    useEffect(()=>{

          fetch('http://localhost:4000/profile',{
            credentials:'include',
          }).then((res)=>{
             res.json().then(userInfo=>{
             setUserInfo(userInfo);
             });
          })

    },[]);

   function logout(){
       fetch('http://localhost:4000/logout',{
            credentials:'include',
            method:'POST',
        });
        setUserInfo(null);
    }

    return(
        <header>
            <Link to="/" className={styles.logo}>Blogs</Link>
            <nav>
                {username &&(
                   <>
                   <Link to="/create"> Create new Post</Link>
                   <Link onClick={logout}>Logout</Link>
                   </> 
                )}
                {!username && (
                    <>
                     <Link to="/login">Login</Link>
                     <Link to="/Register">Register</Link>
                    </>
                )}
             
            </nav>
        </header>
    )
}