const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env'});


mongoose.connect(process.env.DB_URL,
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
    
