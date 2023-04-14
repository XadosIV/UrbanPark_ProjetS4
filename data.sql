INSERT IGNORE INTO `DATABASE`.Parking (id, name, floors, address) VALUES
	('H', 'Halles', 3, '1447 rue des halles 73000 Chambéry'),
	('L', 'Lac', 2, '4 rue des bah 73470 Novalaise'),
	('J', 'Jsépa', 3, '17 rue quelquepart 73000 Chambéry');

INSERT IGNORE INTO `DATABASE`.Spot (id, number, floor, id_park) VALUES
	(0, 1, 0, 'H'),
	(1, 2, 0, 'H'),
	(2, 3, 0, 'H'),
	(3, 4, 0, 'H'),
	(4, 5, 0, 'H'),
	(5, 6, 0, 'H'),
	(6, 7, 0, 'H'),
	(7, 8, 0, 'H'),
	(8, 9, 0, 'H'),
	(9, 10, 0, 'H'),
	(10, 11, 0, 'H'),
	(11, 12, 0, 'H'),

	(12, 1, 1, 'H'),
	(13, 2, 1, 'H'),
	(14, 3, 1, 'H'),

	(15, 1, 2, 'H'),
	(16, 2, 2, 'H'),
	(17, 3, 2, 'H'),

	(18, 1, 0, 'L'),
	(19, 2, 0, 'L'),
	(20, 3, 0, 'L'),

	(21, 1, 1, 'L'),
	(22, 2, 1, 'L'),
	(23, 3, 1, 'L'),

	(24, 1, 0, 'J'),
	(25, 2, 0, 'J'),
	(26, 3, 0, 'J'),

	(27, 1, 1, 'J'),
	(28, 2, 1, 'J'),
	(29, 3, 1, 'J'),

	(30, 1, 2, 'J'),
	(31, 2, 2, 'J'),
	(32, 3, 2, 'J'),
	(33, 4, 2, 'J'),
	(34, 5, 2, 'J'),
	(35, 6, 2, 'J');

INSERT IGNORE INTO `DATABASE`.Role (name, see_other_users, modify_spot_users, modify_role_users, delete_other_user) VALUES
	("Gérant", 1, 1, 1, 1),
	("Gardien", 1, 1, 1, 1);

INSERT IGNORE INTO `DATABASE`.Role (name) VALUES
	("Agent d'entretien"),
	("Abonné");

INSERT IGNORE INTO `DATABASE`.User (id, first_name, last_name, email, password, role, token, id_spot, id_spot_temp) VALUES
	(0, "Jean", "Naej", "jean.naej@mail.com", "1234aaA*", "Gérant", "0000000000000000", NULL, NULL),
	(1, "Hadrien", "Neirdah", "hadrien.neirdah@custom.fr", "*Aaa4321", "Gardien", "1111111111111111", NULL, NULL),
	(2, "Lautregardien", "Lui", "lautregardien.lui@mail.com", "1234aaA*", "Gardien", "2222222222222222", NULL, NULL),
	(3, "Sébastien", "Neitsabés", "sebn@mail.com", "1234aaA*", "Agent d'entretien", "3333333333333333", NULL, NULL),
	(4, "Honoré", "Eronoh", "hono@custom.fr", "1234aaA*", "Abonné", "4444444444444444", 3, 4),
	(5, "Olivier", "Reivilo", "oli.reivi@mailbizarre.com", "1234aaA*", "Aboné", "5555555555555555", 5, NULL),
	(6, "José", "Esoj", "jojo.eso@mail.com", "1234aaA*", "Aboné", "6666666666666666", NULL, NULL);

INSERT IGNORE INTO `DATABASE`.Schedule (id, id_user, id_parking, date_start, date_end) VALUES
	(0, 1, 'H', '2023-04-14 08:00:00', '2023-04-14 16:00:00'),
	(1, 1, 'H', '2023-04-15 08:00:00', '2023-04-15 16:00:00'),
	(2, 1, 'H', '2023-04-16 08:00:00', '2023-04-16 16:00:00'),
	(3, 1, 'H', '2023-04-21 08:00:00', '2023-04-21 16:00:00'),
	(4, 1, 'H', '2023-04-22 08:00:00', '2023-04-22 16:00:00'),
	(5, 1, 'H', '2023-04-23 08:00:00', '2023-04-23 16:00:00'),

	(6, 2, 'H', '2023-04-17 08:00:00', '2023-04-17 16:00:00'),
	(7, 2, 'H', '2023-04-18 08:00:00', '2023-04-18 16:00:00'),
	(8, 2, 'L', '2023-04-19 08:00:00', '2023-04-19 16:00:00'),
	(9, 2, 'L', '2023-04-20 08:00:00', '2023-04-20 16:00:00'),

	(10, 3, 'H', '2023-04-16 08:00:00', '2023-04-16 16:00:00'),
	(11, 3, 'H', '2023-04-17 08:00:00', '2023-04-17 16:00:00'),
	(12, 3, 'L', '2023-04-18 08:00:00', '2023-04-18 16:00:00'),
	(13, 3, 'L', '2023-04-19 08:00:00', '2023-04-19 16:00:00');
	
	
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