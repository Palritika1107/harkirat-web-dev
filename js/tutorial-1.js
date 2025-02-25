// function example(callback){
//     setTimeout(() => {


//         let data = "data fetched";
//         callback(data,null);

//     },5000);
// }

// function handledata(data,error){
//     if(error){

//         console.log(error);

//     }else{
//         console.log(data);
//     }
// }

// example(handledata);

function fetchData(){

return new Promise((resolve, reject) => {
setTimeout(()=>{

    let data = "server error";

    reject(data);
},5000);

});

}

// fetchData()
// .then(
//     result => {console.log(result);
// }).catch(error => {
//     console.log(error)
// })

async function getData(){

    try{

        const res = await fetchData();
        console.log(res);
    }catch(error){
        console.log(error);
    }


}

getData();