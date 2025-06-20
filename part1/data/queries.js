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
                    ROUND(AVG(wr.rating),1) as average_rating,
                    (
                        SELECT
                            COUNT(w_rating_inner.rating_id)
                        from
                            WalkRatings w_rating_inner
                            inner join WalkRequests w_req on w_rating_inner.request_id = w_req.request_id
                        where
                            w_rating_inner.walker_id = w_rating.walker_id
                            and w_req.status = 'completed'
                    ) as completed_walks
                from
                    WalkRatings w_rating
                    inner join Users u on u.user_id = w_rating.walker_id
                where u.role = 'walker'
                group by
                    w_rating.walker_id;`;
module.exports = {
    fetch_dogs_and_owner_name,
    fetch_open_walk_requests,
    fetch_walker_summary
};
