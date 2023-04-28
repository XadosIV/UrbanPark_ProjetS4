INSERT IGNORE INTO `DATABASE`.Parking (id, name, floors, address) VALUES
	('H', 'Halles', 3, '1447 rue des halles 73000 Chambéry'),
	('L', 'Lac', 2, '4 rue des bah 73470 Novalaise'),
	('J', 'Jsépa', 3, '17 rue quelquepart 73000 Chambéry');

INSERT IGNORE INTO `DATABASE`.Spot (id, number, floor, id_park) VALUES
	(1, 1, 0, 'H'),
	(2, 2, 0, 'H'),
	(3, 3, 0, 'H'),
	(4, 4, 0, 'H'),
	(5, 5, 0, 'H'),
	(6, 6, 0, 'H'),
	(7, 7, 0, 'H'),
	(8, 8, 0, 'H'),
	(9, 9, 0, 'H'),
	(10, 10, 0, 'H'),
	(11, 11, 0, 'H'),
	(12, 12, 0, 'H'),

	(13, 1, 1, 'H'),
	(14, 2, 1, 'H'),
	(15, 3, 1, 'H'),

	(16, 1, 2, 'H'),
	(17, 2, 2, 'H'),
	(18, 3, 2, 'H'),

	(19, 1, 0, 'L'),
	(20, 2, 0, 'L'),
	(21, 3, 0, 'L'),

	(22, 1, 1, 'L'),
	(23, 2, 1, 'L'),
	(24, 3, 1, 'L'),

	(25, 1, 0, 'J'),
	(26, 2, 0, 'J'),
	(27, 3, 0, 'J'),

	(28, 1, 1, 'J'),
	(29, 2, 1, 'J'),
	(30, 3, 1, 'J'),

	(31, 1, 2, 'J'),
	(32, 2, 2, 'J'),
	(33, 3, 2, 'J'),
	(34, 4, 2, 'J'),
	(35, 5, 2, 'J'),
	(36, 6, 2, 'J');

INSERT IGNORE INTO `DATABASE`.Role (name, see_other_users, modify_spot_users, modify_role_users, delete_other_user, modify_other_users) VALUES
	("Gérant", 1, 1, 1, 1, 1),
	("Gardien", 1, 1, 1, 1, 1);

INSERT IGNORE INTO `DATABASE`.Role (name) VALUES
	("Agent d'entretien"),
	("Abonné");

INSERT IGNORE INTO `DATABASE`.User (id, first_name, last_name, email, password, role, token, id_spot, id_spot_temp) VALUES
	(1, "Jean", "Naej", "jean.naej@mail.com", "1234aaA*", "Gérant", "0000000000000000", NULL, NULL),
	(2, "Hadrien", "Neirdah", "hadrien.neirdah@custom.fr", "*Aaa4321", "Gardien", "1111111111111111", NULL, NULL),
	(3, "Lautregardien", "Lui", "lautregardien.lui@mail.com", "1234aaA*", "Gardien", "2222222222222222", NULL, NULL),
	(4, "Sébastien", "Neitsabés", "sebn@mail.com", "1234aaA*", "Agent d'entretien", "3333333333333333", NULL, NULL),
	(5, "Honoré", "Eronoh", "hono@custom.fr", "1234aaA*", "Abonné", "4444444444444444", 3, 4),
	(6, "Olivier", "Reivilo", "oli.reivi@mailbizarre.com", "1234aaA*", "Aboné", "5555555555555555", 5, NULL),
	(7, "José", "Esoj", "jojo.eso@mail.com", "1234aaA*", "Aboné", "6666666666666666", NULL, NULL);

INSERT IGNORE INTO `DATABASE`.Schedule (id, id_user, id_parking, date_start, date_end) VALUES
	(1, 2, 'H', '2023-04-14T08:00:00', '2023-04-14T16:00:00'),
	(2, 2, 'H', '2023-04-15T08:00:00', '2023-04-15T16:00:00'),
	(3, 2, 'H', '2023-04-16T08:00:00', '2023-04-16T16:00:00'),
	(4, 2, 'H', '2023-04-21T08:00:00', '2023-04-21T16:00:00'),
	(5, 2, 'H', '2023-04-22T08:00:00', '2023-04-22T16:00:00'),
	(6, 2, 'H', '2023-04-23T08:00:00', '2023-04-23T16:00:00'),

	(7, 3, 'H', '2023-04-17T08:00:00', '2023-04-17T16:00:00'),
	(8, 3, 'H', '2023-04-18T08:00:00', '2023-04-18T16:00:00'),
	(9, 3, 'L', '2023-04-19T08:00:00', '2023-04-19T16:00:00'),
	(10, 3, 'L', '2023-04-20T08:00:00', '2023-04-20T16:00:00');

INSERT IGNORE INTO `DATABASE`.Schedule (id, id_user, id_parking, date_start, date_end, first_spot, last_spot) VALUES
	(11, 4, 'H', '2023-04-16T08:00:00', '2023-04-16T16:00:00',1,4),
	(12, 4, 'H', '2023-04-17T08:00:00', '2023-04-17T16:00:00',5,8),
	(13, 4, 'L', '2023-04-18T08:00:00', '2023-04-18T16:00:00',19,20),
	(14, 4, 'L', '2023-04-19T08:00:00', '2023-04-19T16:00:00',21,21);

INSERT IGNORE INTO `DATABASE`.Type (name) VALUES
	("Abonné"),
	("Handicapée"),
	("Électrique"),
	("Urgence"),
	("Municipale");

INSERT IGNORE INTO `DATABASE`.Typed (`id_spot`, `name_type`) VALUES
	(3, 'Abonné'),
	(4, 'Abonné'),
	(5, 'Abonné'),
	(5, 'Électrique'),
	(7, 'Handicapée'),
	(7, 'Municipale'),
	(10, 'Abonné');
