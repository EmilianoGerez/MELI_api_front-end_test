const express = require('express');
const itemCtrl = require('../controllers/items.controller');

const router = express.Router();

/* GET home page. */
router.get('/items', itemCtrl.itemSearch);

module.exports = router;
