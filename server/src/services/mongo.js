const mongoose = require('mongoose');

const MANGO_URL = process.env.MANGO_URL;

mongoose.connection.once('open', () => {console.log('MongoDB connection ready')});
mongoose.connection.on('error', (err) => {console.error(err)});

async function mongoConnect(){
    // is not needed from mongoose 6.0
     /* await mongooes.connect(MANGO_URL, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    }); */

    await mongoose.connect(MANGO_URL);
};

async function mongoDisconnect(){
    await mongoose.disconnect();
};

module.exports = {
    mongoConnect,
    mongoDisconnect
};