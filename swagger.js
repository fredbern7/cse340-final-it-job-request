const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Job request Api',
        description: 'Job request Api'
    },
    host: 'cse340-final-it-job-request.onrender.com/',
    schemes: ['https'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

//this will generate swagger.json
swaggerAutogen(outputFile, endpointsFiles,doc);