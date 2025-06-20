var express = require('express');
var router = express.Router();
const { query } = require('./data/mysql_config');
const {fetch_dogs_and_owner_name} = require('./data/queries');

/* GET All Dogs information */
router.get('/dogs', async function (req, res, next) {
    try {

        let dogs_with_owner_name_result = await query(fetch_dogs_and_owner_name);
        if(dogs_with_owner_name_result && dogs_with_owner_name_result.l)



    } catch (err) {
        const error_message = `Error occurred during request ${err.message}`;
        console.err(error_message);
        res.status(500).json({ error: error_message });
    }
});

module.exports = router;
