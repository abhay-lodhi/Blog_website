import { Link } from "react-router-dom";
import styles from "../styles/post.module.css";
import { format } from 'date-fns';


export default function Post({_id,title,content, summary,cover, createdAt, author}) {

  return (
  
    <main className={styles.body}>
       
     
      <Link to={`/post/${_id}`} className={`${styles.entry} border rounded`}>

        <div className={`${styles.img} p-3`}>
         
            <img src={`http://localhost:4000/${cover}`} alt="hdkjgdjh" className={`${styles.image} border-0 rounded`}></img>
          
        </div>
        <div className={`${styles.text} p-3`}>
         
            <h2>{title}</h2>
         
          <p className={`${styles.info} p-2 border-bottom border-2`}>
            <a className={styles.author}>
              {author.username}
            </a>
            <time>{format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</time>
          </p>
          <p className={`${styles.summary} p-2`}>{summary}</p>
        </div>
        </Link>
     
      
    </main>
    
  );
}
