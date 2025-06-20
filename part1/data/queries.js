const fetch_dogs_and_owner_name = `SELECT d.name as dog_name, d.size as size, u.username as owner_username from
                                    Dogs d inner join Users u on d.owner_id = u.user_id;`;

const fetch_open_walk_requests = `;`;
module.exports = {
    fetch_dogs_and_owner_name,
    fetch_open_walk_requests
};
