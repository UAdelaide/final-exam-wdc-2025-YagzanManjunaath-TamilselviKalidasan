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
                    u.username as walker_username,
                    COUNT(w_rating.rating_id) as total_ratings,
                    ROUND(AVG(w_rating.rating), 1) as average_rating,
                    COUNT(w_req.request_id) as completed_walks
                from Users u
                        left join WalkRatings w_rating on u.user_id = w_rating.walker_id
                        left join WalkApplications w_appln 
                        left join WalkRequests w_req on w_rating.user_id = w_req.walker_id
                        and w_req.status='completed'
                where
                    u.role = 'walker'
                group by
                    u.user_id;`;
module.exports = {
    fetch_dogs_and_owner_name,
    fetch_open_walk_requests,
    fetch_walker_summary
};
