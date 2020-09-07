var mongoose=require('mongoose');

const taskSchema=new mongoose.Schema({
    description:{
         type: String,
         trim: true,
         required: true
    },
    status: { 
        type: Boolean,
        default: false,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    }
},{
    timestamps: true
})

var task=mongoose.model('Tasks',taskSchema);

module.exports=task;




//for creating a new record and testing the task model
// var task1=new task({ description: 'Homework', status: true });

// task1.save().then(()=>{
//     console.log(task1);
// }).catch((error)=>{
//     console.log(error);
// });