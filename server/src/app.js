const express = require('express');
const cors = require('cors');
const morgan = require('morgan')

const path = require('path');

const apiVOneRouter = require('./routes/api');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/v1', apiVOneRouter);

app.get('/*', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;

//McrhE5n5gHvQsyXL

// clinetID: 1090043395694-rg6p3aiv444adlm1fcsmu2d52nit9jff.apps.googleusercontent.com
// clinetScert: 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