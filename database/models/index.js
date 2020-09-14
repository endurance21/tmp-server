import mongoose from '../../connect.js'

const Schema = mongoose.Schema
const model = mongoose.model

const Person = new Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:32
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:32
    },
    hashedPassword:{
        type:String,
        required:true
    },
    salt:String,
    role:{
        type:Number,
        default:0
    },
    history:{
        type:Array,
        default:[]
    }
} ,{timestamps:true})



export default model('Person',Person)