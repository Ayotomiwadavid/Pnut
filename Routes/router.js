const express = require('express');
const router = express.Router();

const membersController = require('../Controllers/controller');

router.get('/api/getApi', membersController.sendApi);
router.post('/api/sendNutrientData', membersController.receivingData);

module.exports = router