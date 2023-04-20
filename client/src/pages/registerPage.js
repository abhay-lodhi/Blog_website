import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { userContext } from "../userContext";
import styles from '../App.css';

export default function RegisterPage(){

    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const [password2,setPassword2]=useState('');
    const [redirect,setRedirect]= useState('');
    const {setUserInfo}= useContext(userContext);

    async function register(ev){
       ev.preventDefault();

       if(password!=password2){
        alert("Passwords does not match");
        return;
       }
    
       const response= await fetch('http://localhost:4000/register',{
            method:'POST',
            body: JSON.stringify({username, password}),
            headers:{'Content-Type':'application/json' },
           })
      
      if(response.status!=200){
        alert("registration failed");
      }else{
        response.json().then(userInfo=>{
          alert("registered Succesfully");
        //  setUserInfo(userInfo);
          setRedirect(true);
      })  
      }
    }

    if(redirect){
      return <Navigate to={'/login'}/>
    }

    function toLogin(){
      setRedirect(true);
    }

    return(
      <div className="container">
        
        <form classnmae="register" onSubmit={register}> 
            <h1 className="log_req">Register</h1>
            <input 
            type="text"
            placeholder="username" 
            value={username}
            onChange={ev=> setUsername(ev.target.value)}/>

            <input
             type="password" 
             placeholder="password" 
             value={password} 
             onChange={ev => setPassword(ev.target.value)}/>

<input
             type="password" 
             placeholder="Again password" 
             value={password2} 
             onChange={ev => setPassword2(ev.target.value)}/>


            <button type="submit" className="btn_log_reg">Register</button>
            <div className="signinText">
            <p className="log_req" >Already have a account?</p> 
            <button className="signin" type="button"  onClick={toLogin}>Sign In</button>
            </div>
            
          
        </form>
        </div>
    )
}