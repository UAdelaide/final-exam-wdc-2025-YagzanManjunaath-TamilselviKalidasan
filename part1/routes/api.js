var express = require('express');
var router = express.Router();
const { query } = require('./data/mysql_config');
const {fetch_dogs_and_owner_name} = require('./data/queries');

/* GET All Dogs information */
router.get('/dogs', function (req, res, next) {
    try {

        let dogs_with_owner_name_list = await fetch_dogs_and_owner_name


    } catch (err) {
        const error_message = `Error occurred during request ${err.message}`;
        console.err(error_message);
        res.status(500).json({ error: error_message });
    }
});

module.exports = router;
