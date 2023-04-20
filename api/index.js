const express= require("express");
const cors= require("cors");
const mongoose= require("mongoose");
const user= require('./models/user');
const bcrypt= require('bcryptjs');
const jwt= require('jsonwebtoken');
const cookieParser= require('cookie-parser');
const multer= require('multer')
const uploadMiddleware= multer({dest: 'uploads/'});
const fs= require('fs');
const Post= require('./models/post');
require('dotenv').config();


const salt=bcrypt.genSaltSync(10);
const secret= process.env.SECRET;

const app= express();
app.use(express.json());
app.use(cors({credentials:true, origin: 'http://localhost:3000'}));

app.use(cookieParser());

app.use('/uploads',express.static(__dirname +'/uploads'));
// console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI)
.then(
console.log("connected")
)

app.post("/register", async (req,res)=>{
    const {username,password}=req.body;
    try{
        const userDoc= await user.create({
            username,
            password:bcrypt.hashSync(password,salt),
        });

          jwt.sign({username, id:userDoc._id}, secret,{}, (err,token)=>{

            if(err) throw err;
            res.cookie('token',token).json({
             id: userDoc._id,
             username,
            });

        });

    }catch(err){
          res.status(400).json(err);
    }
       
})


app.post("/login",async (req,res)=>{
    const {username,password}= req.body;

    const userDoc= await user.findOne({username: username});

    let passOk=false;

    if(userDoc){
       passOk=  bcrypt.compareSync(password,userDoc.password);
    }
      
    if(passOk){
        //logged in
        jwt.sign({username, id:userDoc._id}, secret,{}, (err,token)=>{

            if(err) throw err;
            res.cookie('token',token).json({
             id: userDoc._id,
             username,
            });

        });

    }else{
        res.status(400).json('wrong credentials');
    }

});

app.get('/profile', (req,res)=>{

    const {token}= req.cookies; 
    const info={
        id: '',
        username:'',
    }
    if(!token){
        res.status(401).json(info);
    }else{
        jwt.verify(token,secret,{}, (err,info)=>{
            if(err)throw err;
             res.json(info);    
         });
    } 
});

app.post('/logout', (req,res)=>{
    res.cookie('token', '').json('ok');
});

app.post('/post',uploadMiddleware.single('file'),async (req,res)=>{

    
    const {originalname, path}= req.file;
    const parts=originalname.split('.');
    const ext= parts[parts.length-1];
    const newPath=path+'.'+ext;
    fs.renameSync(path,newPath);

    const {token}= req.cookies; 

    if(!token) res.status(401).json("sign in");

    jwt.verify(token,secret,{}, async (err,info)=>{

        if(err)throw err;
            
         const {title, summary,content}= req.body;

   try{ const postDoc= await Post.create({
       title,
       summary,
       content,
       cover: newPath,
       author:info.id,
    });

    res.json(postDoc);
    }catch(err){
        res.status(400).json(err);
    }

     });

    
   //console.log(req);
});

app.get('/post', async (req,res)=>{

   const posts= (await Post.find()
   .populate('author', ['username'])
   .sort({createdAt: -1})
   .limit(20)
   );

   res.json(posts);
});

app.get('/post/:id', async (req,res)=>{
    const {id}=req.params;
   
    const postDoc= await Post.findById(id).populate('author',['username']);
    res.json(postDoc);
});

app.put('/post',uploadMiddleware.single('file'), async (req,res)=>{
    let newPath=null;

   // console.log(req.file);
    if(req.file){
        const {originalname, path}= req.file;
        const parts=originalname.split('.');
        const ext= parts[parts.length-1];
        newPath=path+'.'+ext;
        fs.renameSync(path,newPath);
    }
     
    const {token} = req.cookies;

    jwt.verify(token,secret,{}, async (err,info)=>{

        if(err)throw err;
           
        

        
        const {id,title, summary,content}= req.body; 
        const postDoc= await Post.findById(id);
        const isAuthor= JSON.stringify(postDoc.author)===JSON.stringify(info.id);

        if(!isAuthor){
            res.status(400).json*'You are not the author';
        }
           await postDoc.updateOne({
            title,
            summary,
            content,
            cover: newPath? newPath: postDoc.cover,
           });

           res.json(postDoc); 
     });

})


app.listen(4000);

