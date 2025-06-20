SELECT
    d.name as dog_name,
    d.size as size,
    u.username as owner_username
from
    Dogs d
    inner join Users u on d.owner_id = u.user_id;