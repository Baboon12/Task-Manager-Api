const { request, response } = require("express");
const jwt=require('jsonwebtoken');
const user=require('../models/user');

const auth=async (request,response,next)=>{
    try{  
        const token= request.header('Authorization').replace('Bearer ','');
        const decoded= jwt.verify(token,process.env.JWT_SECRET);
        const User=await user.findOne({ _id: decoded._id , 'tokens.token': token });
        
        if(!User){
            throw new Error('A bhai');
        }
        request.token=token;
        request.User=User;
        next();
    } catch(error){
        response.status(401).send({error: 'Auntentication required'});
    }
}

module.exports=auth;