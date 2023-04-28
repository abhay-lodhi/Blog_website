import React, { useContext, useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom';
import ReactQuill from "react-quill";
import styles from "../styles/createPost.module.css";
import Spinner from "../components/spinner";
import { userContext } from '../userContext';


const  modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

const EditPost = () => {

    const {id}=useParams();

    const [title, setTitle]= useState('');
    const [summary, setSummary]= useState('');
    const [content, setContent]= useState('Create Your post here');
    const [files,setFiles]=useState('');
    const {setUserInfo, userInfo}=useContext(userContext);
    const [loading, setLoading] = useState(true)

    const [rediret, setRedirect]= useState(false);

    useEffect(()=>{
        fetch(`http://localhost:4000/post/${id}`)
        .then(res=>{
            res.json()
            .then(postInfo=>{
                setTitle(postInfo.title);
                setContent(postInfo.content);
                setSummary(postInfo.summary);
                setLoading(false)
                setFiles(postInfo.cover);
            });

           // console.log(files);
        });
    },[]);

   async function updatePost(ev){
         ev.preventDefault();
         const data= new FormData();

         data.set('title', title);
         data.set('summary', summary);
         data.set('content', content);
         data.set('id', id);

         if(files?.[0]) data.set('file', files?.[0]);

         const response = await fetch('http://localhost:4000/post',{
            method: 'PUT',
            body: data,
            credentials: 'include',
        });

        if(response.ok){
            setRedirect(true);
        }else{
            alert('error in updating');
        }

        
    }
    
    if(loading){
        return <Spinner/>
    }

    if(rediret){
        return  <Navigate to={'/post/'+id}/>
        } 

    if(userInfo===undefined ||userInfo===null || userInfo.id==='' ){

          //console.log(userInfo+"heyyy");
          //alert("You need to login first");
         
          return  <Navigate to={'/login'}/>
      }
          return(
            <div className="container">
            <form onSubmit={updatePost} className={styles.main}>
              
              <input 
              type="title"
              className={styles.input} 
              placeholder={'Title'}  
              value={title} 
              onChange={ev=> setTitle(ev.target.value)}
              required
              />
      
              <input 
              type="summary" 
              className={styles.input} 
              placeholder={'Summary'}
              value={summary}
              onChange={ev=> setSummary(ev.target.value)}
              required
              />
      
              <input 
              type="file"  
              className={styles.input}
              onChange={ev=> setFiles(ev.target.files)}
              required
               />
      
              <ReactQuill 
              style={{height:"40vh"}}
              className={styles.input} 
              value={content} 
              modules={modules} 
              formats={formats}
              onChange={newVl=>setContent(newVl)}
              />
      
      
              <button className={styles.button}>Update Post</button>
              
            </form>
            </div>
          );
}

export default EditPost