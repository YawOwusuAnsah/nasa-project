const axios = require('axios');

const launchesDatabase = require('./launches.mongo');
const planetsDatabase = require('./planets.mongo');

//const launches = new Map();

//let latestFlightNumber = 100; 
const DEFAULT_FLIGHT_NUMBER = 100;

/* const launch = {
    flightNumber: 100,
    mission: 'kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
};

saveLaunches(launch); */

const SPACEX_API_URL = 'https://api.spacexdata.com/v5/launches/query';

async function populateLaunches(){
    console.log('downloading ');
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    });

    if (response.status !== 200){
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed');
    }

    const launchData = response.data.docs
    for (const lanuching of launchData){
        const payloads = lanuching['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        });

        const launch = {
            flightNumber: lanuching['flight_number'],
            mission: lanuching['name'],
            rocket: lanuching['rocket']['name'],
            launchData: lanuching['date_local'],
            upcoming: lanuching['upcoming'],
            success: lanuching['success'],
            customers
        }

        console.log(`${launch.flightNumber} ${launch.mission}`);

        await saveLaunches(launch);
    };
}

async function laodLaunchData(){
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });

    if (firstLaunch){
        console.log('Launch data already loaded!');
    } else{
        await populateLaunches();
    }

};

async function findLaunch(filter){
    return await launchesDatabase.findOne(filter);
};

//launches.set(launch.flightNumber, launch);

async function getAllLaunches(skip, limit){
    return await launchesDatabase.find({}, {'_id': 0, '__v': 0})
        .sort({ flightNumber: 1 })
        .skip(skip)
        .limit(limit);
    //return Array.from(launches.values());
};

async function getLatestFlightNumber(){
    const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber');

    if(!latestLaunch) return DEFAULT_FLIGHT_NUMBER;

    return latestLaunch.flightNumber;
}

async function saveLaunches(launch){
    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    });
};

async function scheduleNewLaunch(launch){

    const planet = await planetsDatabase.findOne({kepler_name: launch.target});
    if(!planet) throw new Error('No matching planet found');

    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customer: ['Zero to Mastery', 'NASA'],
        flightNumber: newFlightNumber
    });

    await saveLaunches(newLaunch);
};

/* function addNewLaunch(launch){
    latestFlightNumber++
    launches.set(latestFlightNumber, Object.assign(launch, {
        success: true,
        upcoming: true,
        customer: ['Zero to Mastery', 'NASA'],
        flightNumber: latestFlightNumber
    }));
}; */

async function existLaunchWithId(launchId){
    //return launches.has(launchId);
    return await findLaunch({flightNumber: launchId});
};

async function abortLaunchId(launchId){
    const abortedInMongo = await launchesDatabase.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    });

    return abortedInMongo.ok === 1 && abortedInMongo.nModified === 1;
    /* const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted; */
};

module.exports = {
    laodLaunchData,
    existLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchId
};