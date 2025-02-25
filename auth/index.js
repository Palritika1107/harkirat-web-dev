const express = require('express');
const app = express();

const jwt = require("jsonwebtoken");
const JWT_SECRET = "hellorp2024rp";
const mongoose = require("mongoose");
const {UserModel , TodoModel} = require("./db");
const cors = require('cors');


// let users =[]; //array of users

app.use(express.json());
app.use(cors());


mongoose.connect("mongodb+srv://admin:fGUpHgZrZNyqRL7Y@cluster0.zf3dh.mongodb.net/todos-db")

//instead of using this function , we will be using jwt to create a token
// function generateToken(){

//     const chars = [
//         ...'abcdefghijklmnopqrstuvwxyz', // Lowercase letters
//         ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', // Uppercase letters
//         ...'0123456789' // Digits
//       ];
      

      
//       let token = "";

//       for(let i=1;i<=32;i++){

//         token += chars[Math.floor(Math.random() * chars.length)];


//       }

//       return token;
// }


function auth(req,res,next){

    const token = req.headers.token;
    const decodedInfo = jwt.verify(token,JWT_SECRET);
    

    if(decodedInfo){
        req.userId = decodedInfo.id;
        next();
    }
    else{
        res.json({
            "message" : "user not found"
        })
    }



}

//signup
app.post('/signup',async function(req,res){

    const username = req.body.username;
    const password = req.body.password;

    await UserModel.create({
        "username" : username,
        "password" : password

    });

    // console.log(users);

    res.json({
        "message" : "you have successfully signed up"
    });


})

//signin

app.post('/signin' , async function(req,res){

    const username = req.body.username;
    const password = req.body.password;

    const response = await UserModel.findOne({
        username : username,
        password : password,
    });

    if(response){
        const token = jwt.sign({

            id : response._id.toString()

        },JWT_SECRET);
        // user["token"] = token;

        console.log(response);
        
    res.json({

        "token" : token

    })
}else{
    res.status(400).json({
        "message" : "user not found"
    })
}

});

// app.get('/me',auth,function(req,res){

    
//     const username = req.username;

//     let findUser = null;

//     for(let i=0;i<users.length;i++){

//         if(users[i].username === username){
//             findUser = users[i];
//             break;
//         }

//     }

//     if(findUser){
//         res.json({

//             "username" : findUser.username,
//             "password" : findUser.password

//         })
//     }else{
//         res.json({
//             "message" : "token not found"
//         })
//     }


// })

app.post("/todo",auth, async function(req,res){

    const userId = req.userId;
    const taskName = req.body.task;
    const done = req.body.done;


   await  TodoModel.create({
        userId : userId,
        title : taskName,
        done : done
    })
   

    res.json({
        "message" : "add todo now",
        userid : req.userId


    })


});

app.get("/todos",auth, async function(req,res){
        const userId = req.userId;

        const todos = await TodoModel.find({
            userId : userId
        })
   

    res.json({
        todos

    })


});


app.delete('/deletetodo', auth ,async (req, res) => {
    const userId = req.userId; // Extract ID from URL
    try {
        const result = await TodoModel.deleteMany({ userId : userId });
        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully', deletedUser: result });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});



app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});