import mongoose from '../../connect.js'

const Schema = mongoose.Schema
const model = mongoose.model

const Patients= new Schema({
    patientId:{
        type:String
    },
    reportedOn :{
        type:String,
    }
    ,
    ageEstimate : {
        type:String
    },
    gender :{
        type:String
    },
    state:{
        type:String
    },
    status:{
        type:String
    }
} 
,{timestamps:true})





export default model('Patients',Patients)