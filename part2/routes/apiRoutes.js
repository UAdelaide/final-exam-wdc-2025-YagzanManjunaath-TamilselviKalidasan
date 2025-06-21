var express = require('express');
var router = express.Router();
const db = require('../models/db');

/* GET All Dogs information */
router.get('/dogs', async function (req, res, next) {
    try {

        /*
            Fetch Dogs from database using query from queries.js
            */
        const fetch_dogs_and_owner_name =
            `
                SELECT
                    d.name as dog_name,
                    d.size as size,
                    u.username as owner_username
                from
                    Dogs d
                    inner join Users u on d.owner_id = u.user_id
                `;

        const [result] = await db.query(fetch_dogs_and_owner_name, [dog_id, requested_time, duration_minutes, location]);
        let dogs_with_owner_name_result = await query(fetch_dogs_and_owner_name);
        /*
            If no dogs are in the database , return 200 wth empty array
        */
        if (dogs_with_owner_name_result && dogs_with_owner_name_result.length === 0) {
            return res.status(200).json([]);
        }
        /*
           If found, return list as Json with status code 200
        */
        return res.status(200).json(dogs_with_owner_name_result);

    } catch (err) {
        const error_message = `Error occurred during fetch dogs request : ${err.message}`;
        console.error(`ERROR : ${error_message}`);
        return res.status(500).json({ error: error_message });
    }
});


module.exports = router;
