import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "../styles/postpage.module.css"
import { formatISO9075 } from "date-fns";
import { userContext } from "../userContext";
import Spinner from "../components/spinner";

export default function PostPage(){

    const {id}=useParams();
    const [postInfo, setPostInfo]= useState('');
    const {userInfo}= useContext(userContext); 

    useEffect(()=>{
        fetch(`http://localhost:4000/post/${id}`).then(response=>{
             response.json().then(postInfo=>{
                    setPostInfo(postInfo);
             }) 
        })
    },[]);

    if(!postInfo) return <Spinner/>;

    return(
        <div className={styles.main}>
             <h1>{postInfo.title}</h1>
             <time>{formatISO9075(new Date(postInfo.createdAt))}</time>

             <div className={styles.author}>by @{postInfo.author.username}</div>

             {userInfo && userInfo.id===postInfo.author._id &&(
                 

                <div className={styles.editrow}>
                  <Link className={styles.editbtn} to={`/edit/${postInfo
                ._id}`} >
                    Edit</Link>
                </div>
             )}

             
            <div className={styles.img}>
            <img src={`http://localhost:4000/${postInfo.cover}`} alt="" className={styles.image}/>
            </div>
           
            <div dangerouslySetInnerHTML={{__html:postInfo.content}}></div>


        </div>
    )
    


}