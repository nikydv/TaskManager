const mongoose = require('mongoose');

mongoose.connect(
'mongodb+srv://heyNik:8UBuZthmAUbB8jRg@cluster0.l0zap.mongodb.net/TskMgr?retryWrites=true&w=majority',
{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

let db = mongoose.connection;

db.on('error', error => {
    console.error('Error in MongoDb connection: ' + error);
      mongoose.disconnect();
});

db.on('connected', () => console.log('tskMgr Db connected'));
    
