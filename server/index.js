import path from 'path'
import express  from 'express'
import dotenv from 'dotenv'
import bodypParser from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'


// import mongoose from '../database/connect.js' 
import Patients from '../database/models/patients/index.js'
// import patients from '../database/models/patients/index.js'

const __dirname = path.resolve() // why __dirname is not working 
dotenv.config({path:path.resolve(__dirname , '.env')}) 
const port  = process.env.PORT

const app = express()

//third party middlwares 
app.use(bodypParser.json())
app.use(cookieParser())

app.use(morgan('dev'))

//to allow Cross origin requests!
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})



app.get('/hello',(req,res,next)=>{

  res.send("hey there ! , how are you MR DIVYANSHU")
  
})




app.post('/api/patients' , handle) ;


function handle(req, res , next ){
  console.log("hello")
  let {state , gender , age_group , date_range} = req.body;

  let lowerAge = age_group[0]
  let upperAge = age_group[1]

  let lowerLimit = date_range[0]

let upperLimit = date_range[1]
let match ;
  if(gender!= "all"){
      if(state != "india"){
        match = {
          date: {$gte:new Date(lowerLimit) ,$lte: new Date(upperLimit)},
          status:"Recovered",
          gender:gender ,
          state:state
        }
      }else{
         match = {
          date: {$gte:new Date(lowerLimit) ,$lte: new Date(upperLimit)},
          status:"Recovered",
          gender:gender
        }
      }
  }
  else{


    if(state !="india"){
      match = {
        date: {$gte:new Date(lowerLimit) ,$lte: new Date(upperLimit)},
        status:"Recovered",
        // gender:gender ,
        state:state
      }
    }else{
       match = {
        date: {$gte:new Date(lowerLimit) ,$lte: new Date(upperLimit)},
        status:"Recovered",
        // gender:gender
      }
    }
   
  }





Patients.aggregate([
  {
    $project: {
      date: {
        $dateFromString: {
          dateString: "$reportedOn",
          format: "%d/%m/%Y"
        }
      },
      gender:"$gender",
      state:"$state",
      age: "$ageEstimate",
      status:"$status",
    
      

    }
  },
  {
    $match:match
  }
,
{
 
  $match:{
    age:{$gte:lowerAge ,$lte: upperAge}
  }
}
,
{$group:{
  _id:"$date" 
  ,
  total:{$sum:1}
}
},


{
  $sort:{_id:1}
}


] 
).exec((err, result)=>{
  if(err){
    res.status(400);
  }
  res.json(result);
  next()
})






}



// let gender
// let lowerLimit = "2020-30-01"

// // let upperLimit = "2020-03-04"

// let lowerLimit = date_range[0]

// let upperLimit = date_range[1]

// Patients.aggregate([
//   {
//     $project: {
//       date: {
//         $dateFromString: {
//           dateString: "$reportedOn",
//           format: "%d/%m/%Y"
//         }
//       },
//       gender:"$gender",
//       state:"$state",
//       age:"$ageEstimate",
//       status:"$status"

//     }
//   },
//   {
//     $match:{
//       date: {$gte:new Date(lowerLimit) ,$lte: new Date(upperLimit)},
//       status:"Recovered",
//       gender:gender
  
//     }
// },




// ] 
// ).exec((err, result)=>{
//   console.log(result)
//   // if(err){
//   //   res.status(400);
//   // }
//   // res.json(result);
//   // next()
// })





app.listen(port, ()=> console.log("listenig at" + port))