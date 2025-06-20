var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    try
    {const { username, password } = req.body;

    } catch (err) {
        const error_message = `Error occurred during request ${err.message}`;
        console.err(error_message);
        res.status(500).json({ error: error_message });
    }
});

module.exports = router;
