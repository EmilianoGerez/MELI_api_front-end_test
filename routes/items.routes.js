const express = require('express');
const itemCtrl = require('../controllers/items.controller');

const router = express.Router();

/* GET home page. */
router.get('/', itemCtrl.itemSearch);
router.get('/:id', itemCtrl.getItem);

module.exports = router;
