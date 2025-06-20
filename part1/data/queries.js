const fetch_dogs_and_owner_name = `
                SELECT
                    d.name as dog_name,
                    d.size as size,
                    u.username as owner_username
                from
                    Dogs d
                    inner join Users u on d.owner_id = u.user_id;
`;


const fetch_open_walk_requests = `
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

const fetch_walker_summary = `
SELECT
    u.username AS walker_username,
    COUNT(wr.rating_id) AS total_ratings,
    ROUND(AVG(wr.rating), 1) AS average_rating,
    COUNT(rq.request_id) AS completed_walks
FROM
    Users u
    LEFT JOIN WalkRatings wr ON wr.walker_id = u.user_id
    LEFT JOIN WalkApplications wa ON wa.walker_id = u.user_id
    AND wa.status = 'accepted'
    LEFT JOIN WalkRequests rq ON rq.request_id = wa.request_id
    AND rq.status = 'completed'
WHERE
    u.role = 'walker'
GROUP BY
    u.user_id;`;
module.exports = {
    fetch_dogs_and_owner_name,
    fetch_open_walk_requests,
    fetch_walker_summary
};
