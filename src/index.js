const express=require('express');
require('./db/mongoose');
const user_router=require('./routers/user');
const task_router=require('./routers/task');

const app=express();
const port=process.env.PORT

app.use(express.json()); //converts json to object
app.use(user_router);
app.use(task_router);

app.listen(port, ()=>{ //to start the server
    console.log('Server is up on port '+port);
});

