const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const SECRET_KEY = "NoteAPI";

const signup = async (req,res) => {
    //check exiting user
    const {username,email,password} = req.body;
    try{

        const exitingUser = await userModel.findOne({email: email});
        if(exitingUser){
            return res.status(200).json({"message":"User already exists"});
        }

    //Hashed Password
        const hashedPassword = await bcrypt.hash(password,10);

    //User creation
        const result = await userModel.create({
            email:email,
            password: hashedPassword,
            userName: username
        });
        console.log("result = "+result);


    // Token Generate
    const token = jwt.sign({email:result.email,id: result._id,},SECRET_KEY)
    return res.status(201).json({user:result,token:token});

    }catch(error){
        console.log(error);
        return res.status(500).json({message: "Something wen wrong"});

    }
    }

const signin = async (req,res)=>{

    const {email,password} = req.body;

    try{

        const exitingUser = await userModel.findOne({email:email});
        if(!exitingUser){
            return res.status(404).json({message:"User not found"});
        }
        const matchPassword = await bcrypt.compare(password,exitingUser.password);
        if(!matchPassword){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const token = jwt.sign({email:exitingUser.email,id: exitingUser._id,},SECRET_KEY)
        return res.status(200).json({user:exitingUser,token:token});

    }catch(error){
        console.log("got error on login "+error);
        return res.status(500).json({message:"Email login got an error"});
    }


}
//update user name 
const updateProfile = async (req,res)=>{
    const {username} = req.body;
    const userId = req.userId;
    try{
        const updatedUser = await userModel.findByIdAndUpdate(userId,{userName:username},{new:true});
        return res.status(200).json({user:updatedUser});
    }catch(error){
        console.log("got error on update profile "+error);
        return res.status(500).json({message:"Update profile got an error"});
    }
}


module.exports = {signin,signup,updateProfile};