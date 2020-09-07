//CRUD=Create Read Update Delete
var mongodb=require('mongodb');
var mongodbclient=mongodb.MongoClient; 
//mongoClient is a class that contains functions that are required to connect to the database and perfrom CRUD operations.
var objectid=mongodb.ObjectID;
//ObjectId is a class that returns a new unique objectId 

var connectionurl='mongodb://127.0.0.1:27017'; //url to connect to the database
var databasename='task-manager';//name of database
  
var id=new objectid(); //objectid() generates a new objectID

//mongodbclient.connect function takes 2 compulsory arguments 1) the url of database, 2) the options and here the 3rd argument passed is a callback function
mongodbclient.connect(connectionurl,{useUnifiedTopology: true},(error,client)=>{
  if(error){
      console.log('unable to connect to data base');
  }    
  else{
       var db=client.db(databasename);
  }
});     
  
  
  