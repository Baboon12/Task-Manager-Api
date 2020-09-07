const express=require('express');
const router=new express.Router();
const task=require('../models/task');
const auth=require('../middleware/auth');
//create task
router.post('/tasks',auth,async (request,response)=>{
    const entry= new task({
        ...request.body,
        owner: request.User._id
    });
    try{
        await entry.save();
        response.status(201).send(entry);
    } catch(error){
        response.status(400).send(error);
    }
});

//read all task
router.get('/tasks',auth,async (request,response)=>{   
    try{
        const match={}
        const sort={}
         //for data filtering  
        if(request.query.status){
            //since the data in query is a string we have to convert to Boolean
            match.status=request.query.status==="true";
            //the above line is the short syntax of below code
            //if(request.query.status==="true"){
            //    match.status=request.query.status
            //} else {
            //   match.status=request.query.status
            //}
        }

        if(request.query.sortBy){
            const part=request.query.sortBy.split(':');
            sort[part[0]]=part[1]==="desc"? -1 : 1
            //the above line is short code for below: 
            // if(part[1]==="desc"){
            //     sort[part[0]]=-1
            // }
            // else{
            //     sort[part[0]]=1
            // }
        }
    //only the authenticated user's task should be read according to the query
    await request.User.populate({
        path: 'Tasks',
        match: match,
        options: {
            //pagination
            //the data in query is string and it has to be converted to a number using parseInt
            limit: parseInt(request.query.limit),
            skip: parseInt(request.query.skip),
            //sorting
            sort
       }
    }).execPopulate();   
    response.send(request.User.Tasks);
    } catch(error){
        response.status(500).send(error);
    }
});

//read task by ID
router.get('/tasks/:id',auth,async(request,response)=>{
    var _id=request.params.id;
    try{
    //The id of the task is fetched and returned only if the user is authenticated
        const tasks=await task.findOne({_id, owner: request.User._id})
        if(!tasks){
            response.status(404).send();
        }
      response.send(tasks);
    } catch(error){
      response.status(500).send()
    }   
}); 

//Update Task details
router.patch('/tasks/:id',auth,async(request,response)=>{
    var updates=Object.keys(request.body);
    var allowed=['status','description'];
    var valid=updates.every((update)=>{
        return allowed.includes(update);
    });
    if(!valid){ //send error if unknown updates
        return response.status(400).send({error: 'field not found'});
    }

    try{
        var tasks=await task.findOne({_id: request.params.id,owner: request.User._id});

        if(!tasks){
        return response.status(404).send();
        }

        updates.forEach((update)=>{
            tasks[update]=request.body[update];
        });

        await tasks.save();

        response.status(200).send(tasks);
        } catch(error){
            response.status(400).send();
        }
});

//delete task
router.delete('/tasks/:id',auth,async(request,response)=>{
    try{
        var task_del=await task.findOneAndDelete({_id: request.params.id,owner: request.User._id});
        if(!task_del){
            return response.status(404).send({error: 'Task not found'});
        }
        response.send(task_del);
    } catch(error){
        response.status(500).send({error: 'Something went wrong!'});
    }
});

module.exports=router;






/*
//create task
 entry.save().then(()=>{
        reponse.status(201);
        reponse.send(entry);
    }).catch((error)=>{
        reponse.status(400);
        reponse.send(error);
});

//read all task
task.find({}).then((task)=>{
    response.send(task);
}).catch((error)=>{
    response.status(500).send(error);
}); 

//read task by id
task.findById(_id).then((task)=>{
        if(!task){
            return response.status(404).send();
        }
        response.send(task);
    }).catch((error)=>{
        response.status(500).send();
});
*/