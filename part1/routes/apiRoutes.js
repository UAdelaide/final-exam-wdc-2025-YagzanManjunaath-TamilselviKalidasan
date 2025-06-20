var express = require('express');
var router = express.Router();
const { query } = require('../data/mysql_config');
const {
    fetch_dogs_and_owner_name,
    fetch_open_walk_requests,
    fetch_walker_summary

} = require('../data/queries');

/* GET All Dogs information */
router.get('/dogs', async function (req, res, next) {
    try {

        /*
            Fetch Dogs from database using query from queries.js
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
        */
        let dogs_with_owner_name_result = await query(fetch_dogs_and_owner_name);
        /*
            If no dogs are in the database , return 204 No content with emnpty body
        */
        if (dogs_with_owner_name_result && dogs_with_owner_name_result.length === 0) {
            return res.status(204).send();
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


/* GET all open walk requests information */
router.get('/walkrequests/open', async function (req, res, next) {
    try {

        /*
            Fetch Open walks from database using query from queries.js
                const fetch_open_walk_requests =
                    `
                    SELECT
                        w_req.request_id,
                        d.name as dog_name,
                        w_req.requested_time,
                        w_req.duration_minutes,
                        w_req.location,
                        u.username as owner_username
                    from
                        WalkRequests w_req
                        inner join Dogs d on w_req.dog_id = d.dog_id
                        inner join Users u on d.owner_id = u.user_id
                    where
                        w_req.status = 'open';
                    `;


        */
        let open_walk_request_result = await query(fetch_open_walk_requests);
        /*
            If no open requests are in the database , return 204 No content with emnpty body
        */
        if (open_walk_request_result && open_walk_request_result.length === 0) {
            return res.status(204).send();
        }
        /*
           If found, return list as Json with status code 200
        */
        return res.status(200).json(open_walk_request_result);

    } catch (err) {
        const error_message = `Error occurred during fetch open walks request: ${err.message}`;
        console.error(`ERROR : ${error_message}`);
        return res.status(500).json({ error: error_message });
    }
});

/* GET Sumamry of each walker -  ratings and count of completed walks walk requests information */
router.get('/walkers/summary', async function (req, res, next) {
    try {

        /*
            Fetch summary of completed walks using query from queries.js
                const fetch_walker_summary =
                `
                SELECT
                    u.username as walker_username,
                    COUNT(w_rating.rating_id) as total_ratings,
                    CAST(AVG(w_rating.rating) AS DECIMAL(10,1))as average_rating,
                    (
                        SELECT
                            COUNT(w_rating_inner.rating_id)
                        from
                            WalkRatings w_rating_inner
                            inner join WalkRequests
                             w_req on w_rating_inner.request_id = w_req.request_id
                        where
                            w_rating_inner.walker_id = w_rating.walker_id
                            and w_req.status = 'completed'
                    ) as completed_walks
                from
                    WalkRatings w_rating
                    inner join Users u on u.user_id = w_rating.walker_id
                group by
                    w_rating.walker_id;
                `;

        */
        let fetch_walker_summary_result = await query(fetch_walker_summary);
        /*
            If no open requests are in the database , return 204 No content with emnpty body
        */
        if (fetch_walker_summary_result && fetch_walker_summary_result.length === 0) {
            return res.status(204).send();
        }
        /*
           If found, return list as Json with status code 200
        */
        return res.status(200).json(fetch_walker_summary_result);

    } catch (err) {
        const error_message = `Error occurred during fetch open walks request: ${err.message}`;
        console.error(`ERROR : ${error_message}`);
        return res.status(500).json({ error: error_message });
    }
});


module.exports = router;
