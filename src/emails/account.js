const sgmail=require('@sendgrid/mail');
sgmail.setApiKey(process.env.SENDGRID_API_KEY);

sendWelcomeEmail=(email,name)=>{
    sgmail.send({
        to: email,
        from: 'bhavyasura12@gmail.com',
        subject: 'Task Manager Support',
        text: `Welcome to the app ${name} .Let me know how you get along with the app`,
    });
}

sendCancelEmail=(email,name)=>{
    sgmail.send({
        to: email,
        from: 'bhavyasura12@gmail.com',
        subject: 'Task Manager Support',
        text: `Goodbye ${name}. Is there anything we can do for you?`
    });
}
module.exports={
    sendWelcomeEmail,
    sendCancelEmail
}