SELECT
    u.username as walker_username,
    COUNT(w_rating.rating_id) as total_ratings,
    ROUND(AVG(wr.rating), 1) as average_rating,
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
where
    u.role = 'walker'
group by
    w_rating.walker_id;