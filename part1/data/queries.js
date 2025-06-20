const fetch_dogs_and_owner_name = `SELECT d.name as dog_name, d.size as size, u.username as owner_username from
                                    Dogs d inner join Users u on d.owner_id = u.user_id;`;

/*
  {
"request_id": 1,
"dog_name": "Max",
"requested_time": "2025-06-10T08:00:00.000Z",
"duration_minutes": 30,
"location": "Parklands",
"owner_username": "alice123"
}
*/
const fetch_open_walk_requests = `SELECT w_req.request_id, d.name as dog_name, w_req.requested_time, w_req.duration_minutes,
                                    w_req.location,u.username as owner_username from w_req
                                    inner join Dogs d on w_req.dog_id = d.dog_id
                                    inner join Users u on d.owner_id = u.user_id;
                                    ;`;
module.exports = {
    fetch_dogs_and_owner_name,
    fetch_open_walk_requests
};
