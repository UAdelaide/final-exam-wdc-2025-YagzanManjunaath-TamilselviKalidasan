const fetch_dogs_and_owner_name = `SELECT d.name as dog_name, d.size as size, u.name as owner_username from Dogs d inner join Users u on d.`;

module.exports ={
 fetch_dogs_and_owner_name

}