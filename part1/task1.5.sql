-- Five users:
-- A user with the username alice123, email alice@example.com, password hash hashed123, and role owner.
-- A user with the username bobwalker, email bob@example.com, password hash hashed456, and role walker.
-- A user with the username carol123, email carol@example.com, password hash hashed789, and role owner.
-- Two more users with details of your choosing.
INSERT INTO Users(username,email,password_hash,role) values ('alice123','alice@example.com','hashed123','owner');
INSERT INTO Users(username,email,password_hash,role) values ('bobwalker','bob@example.com','hashed123','walker');
INSERT INTO Users(username,email,password_hash,role) values ('carol123','carol@example.com','hashed123','owner');
INSERT INTO Users(username,email,password_hash,role) values ('batman','brucewayne@example.com','martha123','owner');
INSERT INTO Users(username,email,password_hash,role) values ('alfred','alfred@example.com','thomas123','walker');


-- Five dogs:
-- A dog named Max, who is medium-sized and owned by alice123.
-- A dog named Bella, who is small and owned by carol123.
-- Three more dogs with details of your choosing.

INSERT INTO Dogs(name,size,owner_id) values ('Max','medium',
    (SELECT Users.user_id from Users where Users.username  = 'alice123')
);

INSERT INTO Dogs(name,size,owner_id) values ('Bella','small',
    (SELECT Users.user_id from Users where Users.username  = 'carol123')
);

INSERT INTO Dogs(name,size,owner_id) values ('Ace','large',
    (SELECT Users.user_id from Users where Users.username  = 'batman')
);

INSERT INTO Dogs(name,size,owner_id) values ('Krypto','medium',
    (SELECT Users.user_id from Users where Users.username  = 'batman')
);

INSERT INTO Dogs(name,size,owner_id) values ('Sugar','medium',
    (SELECT Users.user_id from Users where Users.username  = 'alice123')
);

-- Five walk requests:
-- A request for Max at 2025-06-10 08:00:00 for 30 minutes at Parklands, with status open.
-- A request for Bella at 2025-06-10 09:30:00 for 45 minutes at Beachside Ave, with status accepted.
-- Three more walk requests with details of your choosing.

INSERT INTO WalkRequests(dog_id,requested_time,duration_minutes,location,status) values (
     (SELECT Dogs.dog_id from Dogs where Dogs.name  = 'Max'),'2025-06-10 08:00:00',30,'Parklands','open'
);
INSERT INTO WalkRequests(dog_id,requested_time,duration_minutes,location,status) values (
     (SELECT Dogs.dog_id from Dogs where Dogs.name  = 'Bella'),'2025-06-10 09:30:00',45,'Beachside Ave','accepted'
);

INSERT INTO WalkRequests(dog_id,requested_time,duration_minutes,location,status) values (
     (SELECT Dogs.dog_id from Dogs where Dogs.name  = 'Krypto'),'2025-06-12 10:30:00',30,'Metropolis','open'
);

INSERT INTO WalkRequests(dog_id,requested_time,duration_minutes,location,status) values (
     (SELECT Dogs.dog_id from Dogs where Dogs.name  = 'Ace'),'2025-06-12 10:30:00',30,'Wayne Manor grounds',''
);