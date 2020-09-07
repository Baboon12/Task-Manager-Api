var mongoose=require('mongoose');
var validation=require('validator');
const bc=require('bcryptjs');
const authenticate=require('jsonwebtoken');
const task=require('./task');
const userSchema=new mongoose.Schema({
    //fields as properties
    name:{  //its value will be an object
        type: String, //to determine the type of property
        required: true,
        trim: true,//to eliminate leading or trailing empty spaces
    },
    email: {
      type: String,

      required: true,
      unique: true,
      trim: true,
      validate(value){
          if( !validation.isEmail(value) ){
              throw new Error('Email is invalid');
          }
      }  
    },
    age:{ //its value will be an object
        type: Number, 
        default: 0,
        validate(value){
            if(value<0){
                throw new Error('Age must be a positive number!');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
             if(value.includes("password")){
                throw new Error('Password should not contain "password" ');
            }
        },
    },
    tokens: [{
       token:{
           type: String,
           required: true
       } 
    }],
    avatar: {
        type: Buffer
    }
},{
    timestamps: true
});

userSchema.virtual('Tasks',{ //name of mongoose model of task
    ref: 'Tasks', //name of mongoose model of task
    localField: '_id',
    foreignField: 'owner',
});

//toJSON is a javascript function to maninpulate the json output
userSchema.methods.toJSON=function(){
    const User=this;
    const userobject=User.toObject();
    delete userobject.password;
    delete userobject.tokens;
    delete userobject.avatar;
    return userobject;
}

userSchema.methods.generate_token=async function(){
    const User=this;
    const token=authenticate.sign({ _id: User._id.toString() },process.env.JWT_SECRET);
    User.tokens=User.tokens.concat({token});
    await User.save();
    return token;
}

userSchema.statics.findByCredentials= async(email1,password1)=>{
    const User=await user.findOne({email: email1});
    if(!User){
         throw new Error('Unable to Login');
    }

    const ismatch=await bc.compare(password1,User.password);
    if(!ismatch){
         throw new Error('Unable to Login');
    }
     return User;
}


//   *Hashing Plain password before saving*
//pre method for doing something before an event. The event will be the 1st parameter of 'pre' method
userSchema.pre('save', async function (next){ //here normal function is used because 'this' keyword does not bind in arrow function
    const User=this;
    if(User.isModified('password')){
        User.password= await bc.hash(User.password,8);
    }
    return user
});


//delete user tasks when the user is removed
userSchema.pre('remove',async function(next){
    const User=this
    await task.deleteMany({owner: User._id});
    next()
});

//model function accepts 2 arguments. First Argument is the name of the model and second argument is the definition of fields we want
var user=mongoose.model('user',userSchema);

module.exports=user;


//for creating a record in database

//as user is a constructor, it will be preceeded by 'new' keyword
// var instance1=new user({
//     name: 'Bhavya   ',
//     email: 'Bhavya@Gmail.com   ',
//     password: 'pass@d1234'
// });
// //mongoose allows custom validation

//for saving the data of instance1 to database, we have to use method on instance1
// var test=instance1.save(); //save method does not take any arguments and returns a promise as a callback

// test.then(()=>{
//     console.log(instance1);
// }).catch((e)=>{
//     console.log(e);
// });