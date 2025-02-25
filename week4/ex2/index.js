const express = require('express');

const app = express();

function calculateSum(n){

  let sum = 0;

  for(let i=1;i<=n;i++){

    sum += i;

  }

  return sum;
}

//route handlers

app.get('/',function(req,res){

  // res.send('get Hello world!');

  const nos = req.query.n;
  const result = calculateSum(nos);

  res.send(result.toString());

});

app.post('/',function(req,res){

  res.send('post Hello World!');

});



//write calculateSum function that calculates sum of numbers form 1 to n
//expose it using http server and perform GET request to obtain output



app.listen(3000);