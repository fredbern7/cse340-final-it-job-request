const router = require('express').Router();
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

router.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

module.exports = router;
