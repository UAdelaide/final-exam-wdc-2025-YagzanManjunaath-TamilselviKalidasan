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
    u.user_id;