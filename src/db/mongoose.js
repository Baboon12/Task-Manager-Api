var mongoose=require('mongoose');


mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true, 
    useCreateIndex: true,//to create indexs when working with mongodb allowing us to quickly access the data
    useUnifiedTopology: true,
    useFindAndModify: false,
});
//used to connect to the database. 1st parameter is the URL

