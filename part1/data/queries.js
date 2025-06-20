const fetch_dogs_and_owner_name = `SELECT d.name as dog_name, d.size as size, u.username as owner_username from
                                    Dogs d inner join Users u on d.owner_id = u.user_id;`;


const fetch_open_walk_requests = `SELECT w_req.request_id, d.name as dog_name, w_req.requested_time,
                                         w_req.duration_minutes,w_req.location,u.username as owner_username
                                            from WalkRequests w_req
                                                inner join Dogs d on w_req.dog_id = d.dog_id
                                                inner join Users u on d.owner_id = u.user_id
                                            where w_req.status = 'open';`;

/**
 *   {
"walker_username": "newwalker",
"total_ratings": 0,
"average_rating": null,
"completed_walks": 0
}
 */

const fetch_walker_summary = `SELECT u.username as walker_username, COUNT(ratings_id) as total_ratings, AVG(rating) as average_rating
(SELECT COUNT(ratings_id) from WalkRatings where )
 .request_id, d.name as dog_name, w_req.requested_time,
;`;
module.exports = {
    fetch_dogs_and_owner_name,
    fetch_open_walk_requests
};
