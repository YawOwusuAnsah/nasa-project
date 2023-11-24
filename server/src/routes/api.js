const express = require('express');

const planetsRouter = require('./planets/planets.router');
const launchesRouter = require('./launches/launches.router');

const apiVOneRouter = express.Router();

apiVOneRouter.use('/planets', planetsRouter);
apiVOneRouter.use('/lanuches', launchesRouter);

module.exports = apiVOneRouter;