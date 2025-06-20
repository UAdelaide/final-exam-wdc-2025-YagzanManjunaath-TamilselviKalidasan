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