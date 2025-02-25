const express = require('express');
const app = express();

function middleware(req,res,next){

    console.log("middleware called");
    // res.json({
    //     "res" : "ended response"
    // })

    next();


}

app.use(middleware);

app.get("/sum",function(req,res){

    let a = parseInt(req.query.a,10);
    let b = parseInt(req.query.b,10);

    res.json({
        "sum" : a + b
    })
});

app.get("/multiply",function(req,res){

    let a = parseInt(req.query.a,10);
    let b = parseInt(req.query.b,10);

    res.json({
        "sum" : a * b
    })
});





app.listen(3000);