const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env'});

console.log('url: ', process.env.DB_URL)
const DB = process.env.DB_URL.replace(
    '<PASSWORD>',
    process.env.DB_PASSWORD
  );

mongoose.connect(DB,
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
    
