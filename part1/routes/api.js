var express = require('express');
var router = express.Router();
const { query } = require('./data/mysql_config');
const { fetch_dogs_and_owner_name } = require('./data/queries');

/* GET All Dogs information */
router.get('/dogs', async function (req, res, next) {
    try {

        /*
            Fetch Dogs from database using query from queries.js
            const fetch_dogs_and_owner_name =
            `
            SELECT d.name as dog_name, d.size as size, u.name as owner_username
                from Dogs d inner join Users u on d.owner_id = u.user_id
            `
        */
        let dogs_with_owner_name_result = await query(fetch_dogs_and_owner_name);
        /*
            If no dogs are in the database , return 204 No content with emnpty body
        */
        if (dogs_with_owner_name_result && dogs_with_owner_name_result.length === 0) {
            return res.status(204).send();
        }

        




    } catch (err) {
        const error_message = `Error occurred during request ${err.message}`;
        console.err(error_message);
        res.status(500).json({ error: error_message });
    }
});

module.exports = router;
