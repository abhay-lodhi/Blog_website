import ReactQuill from "react-quill";
import styles from "../styles/createPost.module.css";
import 'react-quill/dist/quill.snow.css';
import { useContext, useEffect, useState } from "react";
import { Form, Link, Navigate } from "react-router-dom";
import { userContext } from "../userContext";

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


export default function CreatePost(){
  
    const {setUserInfo, userInfo}=useContext(userContext);
    const [title, setTitle]= useState('');
    const [summary, setSummary]= useState('');
    const [content, setContent]= useState('Create Your post here');
    const [files,setFiles]=useState('');
    const [rediret, setRedirect]= useState('');

    async function createNewPost(ev){

     const data= new FormData();

     if(content==''){
       alert("Content can't be empty");
       return;
      }

     data.set('title',title );
     data.set('summary',summary );
     data.set('content',content );
     data.set('file', files[0]);

       ev.preventDefault();
       //console.log(files);
     const response = await fetch('http://localhost:4000/post',{
         method: 'POST',
         body: data,
         credentials:'include',

       });


     if(response.ok){
       setRedirect(true);
  }else if(response.status==401){
       alert('Error in Saving');
  }
}

if(userInfo===undefined ||userInfo===null || userInfo.id==='' ){

 
  return  <Navigate to={'/login'}/>
}
// else{
//   //console.log(userInfo);
//   console.log("h1");
// }


  if(rediret){
  return  <Navigate to={'/'}/>
  }

  
    return(
      <div className="container">
      <form onSubmit={createNewPost} className={styles.main}>
        
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
   
        <button className={styles.button}>Create Post</button>
        
      </form>
      </div>
    );
}