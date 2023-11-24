const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const planets = require('./planets.mongo');
//let planets = []

function isHabitablePlanet(planet){
    return planet['koi_disposition'] === 'CONFIRMED' && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11 && planet['koi_prad'] < 1.6;
};

// const results = [];

async function savePlanet(planet){
    try {
        await planets.updateOne({
            kepler_name: planet.kepler_name 
        }, {
            kepler_name: planet.kepler_name
        }, {
            upsert: true
        });
    } catch (error) {
        console.error(`Could not save planet ${error}`)
    }
};

async function getAllPlanets(){
    return await planets.find({});//results
};

function loadPlanetsData(){
    return new Promise((resolve, rejects) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
        .pipe(parse({
                comment: '#',
                columns: true,
            }))
            .on('data', async (data) => {
                if(isHabitablePlanet(data)){
                    //results.push(data)
                    //TODO: Replace below create with insert + update = upsert
                    /* await planets.create({
                        kepler_name: data.kepler_name 
                    }); */
                    savePlanet(data);
                };
            })
            .on('error', (error) => {
                console.log(error)
                rejects(error)
            })
            .on('end', async () => {
                /* console.log(results.map(planet => {
                    return planet['kepler_name'];
                })); */
                const countPlanetsFound = (await getAllPlanets()).length
                console.log(`${countPlanetsFound} habitable planets found`);
                console.log('done');
                resolve()
            });
    });
};


module.exports = {
    loadPlanetsData,
    getAllPlanets
}