var express = require('express');
var router = express.Router();
const { query } = require('./data/queries');

/* GET Dog listing. */
router.get('/dogs', function (req, res, next) {
    try {



    } catch (err) {
        const error_message = `Error occurred during request ${err.message}`;
        console.err(error_message);
        res.status(500).json({ error: error_message });
    }
});

module.exports = router;
