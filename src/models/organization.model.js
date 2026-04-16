import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
  name :{
    type:String,
    required :true,
    trim:true
  },
  domain:{
    type:String,
    required : true,
    unique: true,
    lowercase :true,
    trim:true
  },
  logo:{
    type:String,
    default:null
  },
  createdBy:{
    type : mongoose.Schema.Types.ObjectId,
    ref:'User',
    // required :true
  },
  isActive:{
    type: Boolean,
    default:true
  },
},
  {timestamps:true},

)

const Organization = mongoose.model('Organization',organizationSchema)

export default Organization