const express=require('express');
const router=new express.Router();
var user=require('../models/user');
const { update } = require('../models/user');
const auth=require('../middleware/auth'); //middleware
const { request } = require('express');
const file_upload=require('multer');
const { MulterError } = require('multer');
const sharp=require('sharp')
const {sendWelcomeEmail,sendCancelEmail}=require('../emails/account');
//   /Users/Bhavya/mongodb/bin/mongod.exe --dbpath=/Users/Bhavya/mongodb-data

//create new user
router.post('/users', async (request,response)=>{
    var User=new user(request.body);
    try{
        await User.save();
        sendWelcomeEmail(User.email,User.name);
        const token=await User.generate_token();
        response.status(201).send({user: User,token: token});
    } catch(error){
        response.status(400).send(error);
    }
});

// login
router.post('/users/login',async (request,response)=>{
    try{
        const User=await user.findByCredentials(request.body.email,request.body.password);
        const token= await User.generate_token();
        response.send({user: User,token: token});
    } catch(error){
        response.status(404).send();
    }
});

//logout
router.post('/users/logout',auth, async(request,response)=>{
    try{
        request.User.tokens=request.User.tokens.filter((token)=>{
            return token.token !== request.token;
        });
        await request.User.save();
        response.send('Logged Out');
    } catch(error){
        response.status(500).send();
    }
});

//logout from all instances or devices
router.post('/users/logoutall',auth,async(request,response)=>{
    try{
        request.User.tokens=[]
        await request.User.save();
        response.send('Logged Out From All Devices');
    } catch(error){
        response.status(500).send();
    }
});

//read user profile 
router.get('/users/me',auth,async (request,response)=>{
    response.send(request.User);
});

//update user details. Patch is to update an existing http request
router.patch('/users/me',auth,async(request,response)=>{

    var updates=Object.keys(request.body); //Keys gives the list of objects in body
    var allowed=['name','age','email','password'];
    var isvalid=updates.every((update)=>{
        //the 'every' method will check that if all the objects of updaets are in allowed. If all the objects are found then it will return true. If any one object is not found then it will return false
        return allowed.includes(update);
    });
    if(!isvalid){
        return response.status(400).send({ error: 'Invalid Updates or Field Not Found'});
    }
    try{
         updates.forEach((update)=>{ 
             //since the updation of data is being done dynamically,we don''t know which field is being updated,so in updates array we check each entry that is being updated.The value of property that is being updated will be stored in 'update' and indicating us that updation is done in a specific feild
            request.User[update]=request.body[update]
         });
         await request.User.save();
         response.send(request.User);
    } catch(error){
        response.status(400).send(error); //if validation went wrong
    }
});       

//delete user
router.delete('/users/me',auth,async(request,response)=>{  
    try{
        await request.User.remove();
        sendCancelEmail(request.User.email,request.User.name);
        response.status(200).send(request.User);
    } catch(error){ //if something went wrong
        response.status(500).send({error: 'something went wrong!'});
    }
});

const file=file_upload({
    limits:{
        fileSize: 1000000
    },
    fileFilter(request,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload image file'));
        }
        cb(undefined,true); 
    },
});

router.post('/users/me/avatar',auth,file.single('avatar'),async(request,response)=>{
    const buffer=await sharp(request.file.buffer).resize({width: 250, height: 350}).png().toBuffer();
    request.User.avatar=buffer;
    await request.User.save();
    response.send('Profile Picture Uploaded Successfully!');
},(error,request,response,next)=>{
    response.status(400).send({Error:error.message});
});

router.delete('/users/me/avatar',auth,async(request,response)=>{
    if(request.User.avatar==undefined){
        return response.send('No Picture Uploaded')
    }
    request.User.avatar=undefined;
    await request.User.save();
    response.send('Profile Picture deleted');
},(error,request,response,next)=>{
    response.status(400).send({Error: error.message});
});


router.get('/users/:id/avatar',async(request,response)=>{
    try{
        const User=await user.findById(request.params.id);
        if(!User | !User.avatar){
            throw new Error('No image found');
        } 
        response.set('Content-Type','image/jpg') 
        response.send(User.avatar);
    } catch(error){
        response.send('No Picture Found!');
    }
});

module.exports=router;
















// //read user by ID
// router.get('/users/:id', async (request,response)=>{
//     var _id=request.params.id;

//     try{
//         var User=await user.findById(_id);
//         if(!User){
//             return response.status(404).send();
//         }
//         response.send(User);
//     } catch(error){
//         response.status(500).send();
//     }  
// });









/*
//read by ID
user.findById(_id).then((user)=>{
        if(!user){
            return reponse.status(404).send();
        }
        response.send(user);
    }).catch((error)=>{
        response.status(500).send();
    }); 

//read all
user.find({}).then( (users)=>{ 
        response.send(users);
    }).catch( (error)=>{
        response.status(500);
        response.send(error);
    });    

//create user
entry.save().then(()=>{
        response.status(201);
        response.send(entry);
    }).catch((error)=>{
        response.status(400);
        response.send(error);
    });
*/