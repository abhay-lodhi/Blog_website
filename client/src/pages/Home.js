import { useEffect, useState } from "react";
import Post from "../components/post";
import Spinner from "../components/spinner";


export default function Home(){

    const [posts,setPosts]= useState('');
    const [loading,setLoading]=useState(true);
    
    useEffect(()=>{
    fetch('http://localhost:4000/post').then(response=>{
             response.json().then(posts=>{
             setPosts(posts);
             setLoading(false);
             console.log(posts);

        });        
        });
    },[]);

    if(loading){
        return (
            // <div style={{ display:"flex",alignContent:"center", alignItems:"center", height:"100%", flexWrap:"wrap"}}>
            <Spinner/>
            // </div>
        )
    }

    if(!loading && posts.length==0){
        return(
            <div>empty</div>
        )
    }

    
    return (
        <>
       <div style={{height:"87vh", marginTop:"1.8rem"}}>
        {posts.length>0 && posts.map(post=>(
            <Post key={post._id} {...post} />
        ))}
        </div>
        </>
    )
}