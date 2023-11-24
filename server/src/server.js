const http = require('http');

require('dotenv').config();

const { laodLaunchData } = require('./models/launches.model');
const { loadPlanetsData } = require('./models/planets.model');
const app = require('./app');
const { mongoConnect } = require('./services/mongo');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer(){
    await mongoConnect();
    await loadPlanetsData();
    await laodLaunchData();
    
    server.listen(PORT, (err) => {
        if (err)
            console.error(err);
        console.log(`Server is listening on localhost:${PORT} or ::1:${PORT} or 127.0.0.1:${PORT}`);
    });
};

startServer();