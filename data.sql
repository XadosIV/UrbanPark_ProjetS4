INSERT IGNORE INTO Parking (id, name, floors, address) VALUES
	('H', 'Halles', 3, '1447 rue des halles 73000 Chambéry'),
	('L', 'Lac', 2, '4 rue du Lac 73470 Novalaise'),
	('D', 'Ducs', 3, '17 allée des Ducs 73000 Chambéry');

INSERT IGNORE INTO Spot (id, number, floor, id_park) VALUES
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
	(13, 13, 0, 'H'),
	(14, 14, 0, 'H'),
	(15, 15, 0, 'H'),

	(16, 1, 1, 'H'),
	(17, 2, 1, 'H'),
	(18, 3, 1, 'H'),
	(19, 4, 1, 'H'),
	(20, 5, 1, 'H'),
	(21, 6, 1, 'H'),
	(22, 7, 1, 'H'),
	(23, 8, 1, 'H'),
	(24, 9, 1, 'H'),
	(25, 10, 1, 'H'),
	(26, 11, 1, 'H'),
	(27, 12, 1, 'H'),
	(28, 13, 1, 'H'),
	(29, 14, 1, 'H'),
	(30, 15, 1, 'H'),
	
	(31, 1, 2, 'H'),
	(32, 2, 2, 'H'),
	(32, 3, 2, 'H'),
	(33, 4, 2, 'H'),
	(34, 5, 2, 'H'),
	(35, 6, 2, 'H'),
	(37, 7, 2, 'H'),
	(38, 8, 2, 'H'),
	(39, 9, 2, 'H'),
	(40, 10, 2, 'H'),
	(41, 11, 2, 'H'),
	(42, 12, 2, 'H'),
	(43, 13, 2, 'H'),
	(44, 14, 2, 'H'),
	(45, 15, 2, 'H'),
	
	(46, 1, 0, 'L'),
	(47, 2, 0, 'L'),
	(48, 3, 0, 'L'),
	(49, 4, 0, 'L'),
	(50, 5, 0, 'L'),
	(51, 6, 0, 'L'),
	(52, 7, 0, 'L'),
	(53, 8, 0, 'L'),
	(54, 9, 0, 'L'),
	(55, 10, 0, 'L'),
	(56, 11, 0, 'L'),
	(57, 12, 0, 'L'),
	(58, 13, 0, 'L'),
	(59, 14, 0, 'L'),
	(60, 15, 0, 'L'),

	(61, 1, 1, 'L'),
	(62, 2, 1, 'L'),
	(63, 3, 1, 'L'),
	(64, 4, 1, 'L'),
	(65, 5, 1, 'L'),
	(66, 6, 1, 'L'),
	(67, 7, 1, 'L'),
	(68, 8, 1, 'L'),
	(69, 9, 1, 'L'),
	(70, 10, 1, 'L'),
	(71, 11, 1, 'L'),
	(72, 12, 1, 'L'),
	(73, 13, 1, 'L'),
	(74, 14, 1, 'L'),
	(75, 15, 1, 'L'),

	(76, 1, 0, 'D'),
	(77, 2, 0, 'D'),
	(78, 3, 0, 'D'),
	(79, 4, 0, 'D'),
	(80, 5, 0, 'D'),
	(81, 6, 0, 'D'),
	(82, 7, 0, 'D'),
	(83, 8, 0, 'D'),
	(84, 9, 0, 'D'),
	(85, 10, 0, 'D'),
	(86, 11, 0, 'D'),
	(87, 12, 0, 'D'),
	(88, 13, 0, 'D'),
	(89, 14, 0, 'D'),
	(90, 15, 0, 'D'),

	(91, 1, 1, 'D'),
	(92, 2, 1, 'D'),
	(93, 3, 1, 'D'),
	(94, 4, 1, 'D'),
	(95, 5, 1, 'D'),
	(96, 6, 1, 'D'),
	(97, 7, 1, 'D'),
	(98, 8, 1, 'D'),
	(99, 9, 1, 'D'),
	(100, 10, 1, 'D'),
	(101, 11, 1, 'D'),
	(102, 12, 1, 'D'),
	(103, 13, 1, 'D'),
	(105, 14, 1, 'D'),
	(105, 15, 1, 'D'),
	
	(106, 1, 2, 'D'),
	(107, 2, 2, 'D'),
	(108, 3, 2, 'D'),
	(109, 4, 2, 'D'),
	(110, 5, 2, 'D'),
	(111, 6, 2, 'D'),
	(112, 7, 2, 'D'),
	(113, 8, 2, 'D'),
	(114, 9, 2, 'D'),
	(115, 10, 2, 'D'),
	(116, 11, 2, 'D'),
	(117, 12, 2, 'D'),
	(118, 13, 2, 'D'),
	(119, 14, 2, 'D'),
	(120, 15, 2, 'D');

INSERT IGNORE INTO Role (name, see_other_users, modify_spot_users, modify_role_users, delete_other_user, modify_other_users) VALUES
	("Gérant", 1, 1, 1, 1, 1),
	("Gardien", 1, 1, 1, 1, 1);

INSERT IGNORE INTO Role (name) VALUES
	("Agent d'entretien"),
	("Abonné");

INSERT IGNORE INTO User (id, first_name, last_name, email, password, role, token, id_spot, id_spot_temp, id_park_demande) VALUES
	(1, "Jean", "Wayntal", "jean.wayntal@gmail.com", "MGI5Yjc2MjkzY2MwMjlkYzRiNjM1YmJlYTM4NWRjZDkyNmMzMmFlYmNmNmUzMWVlZTI5NTA3ZTZlMGJiMWRmNg==", "Gérant", "0000000000000000", NULL, NULL, Null),
	(2, "Hadrien", "Dupont", "hadrien.dupont@gmail.com", "MGI5Yjc2MjkzY2MwMjlkYzRiNjM1YmJlYTM4NWRjZDkyNmMzMmFlYmNmNmUzMWVlZTI5NTA3ZTZlMGJiMWRmNg==", "Gardien", "1111111111111111", NULL, NULL, NULL),
	(3, "Laurent", "Ruquier", "laurent.ruquier@gmail.com", "MGI5Yjc2MjkzY2MwMjlkYzRiNjM1YmJlYTM4NWRjZDkyNmMzMmFlYmNmNmUzMWVlZTI5NTA3ZTZlMGJiMWRmNg==", "Gardien", "2222222222222222", NULL, NULL, NULL),
	(4, "Sébastien", "Cousteau", "sebastien.cousteau@gmail.com", "MGI5Yjc2MjkzY2MwMjlkYzRiNjM1YmJlYTM4NWRjZDkyNmMzMmFlYmNmNmUzMWVlZTI5NTA3ZTZlMGJiMWRmNg==", "Agent d'entretien", "3333333333333333", NULL, NULL, NULL),
	(5, "Honoré", "Macron", "honore.macron@gmail.com", "MGI5Yjc2MjkzY2MwMjlkYzRiNjM1YmJlYTM4NWRjZDkyNmMzMmFlYmNmNmUzMWVlZTI5NTA3ZTZlMGJiMWRmNg==", "Abonné", "4444444444444444", 3, 4, "H"),
	(6, "Olivier", "Genay", "olivier.genay@gmail.com", "MGI5Yjc2MjkzY2MwMjlkYzRiNjM1YmJlYTM4NWRjZDkyNmMzMmFlYmNmNmUzMWVlZTI5NTA3ZTZlMGJiMWRmNg==", "Abonné", "5555555555555555", 5, NULL, "H"),
	(7, "José", "Bouraly", "jose.bouraly@gmail.com", "MGI5Yjc2MjkzY2MwMjlkYzRiNjM1YmJlYTM4NWRjZDkyNmMzMmFlYmNmNmUzMWVlZTI5NTA3ZTZlMGJiMWRmNg==", "Abonné", "6666666666666666", NULL, NULL, "J");

INSERT IGNORE INTO Schedule (id, type, id_parking, date_start, date_end) VALUES
	(1, "Gardiennage", 'D', '2023-05-14T08:00:00', '2023-05-14T16:00:00'),
	(2, "Gardiennage", 'H', '2023-05-15T08:00:00', '2023-05-15T16:00:00'),
	(3, "Gardiennage", 'D', '2023-05-16T08:00:00', '2023-05-16T16:00:00'),
	(4, "Gardiennage", 'H', '2023-05-21T08:00:00', '2023-05-21T16:00:00'),
	(5, "Gardiennage", 'L', '2023-05-22T08:00:00', '2023-05-22T16:00:00'),
	(6, "Gardiennage", 'D', '2023-05-23T08:00:00', '2023-05-23T16:00:00'),

	(7, "Gardiennage", 'H', '2023-05-17T08:00:00', '2023-05-17T16:00:00'),
	(8, "Gardiennage", 'H', '2023-05-18T08:00:00', '2023-05-18T16:00:00'),
	(9, "Gardiennage", 'L', '2023-05-19T08:00:00', '2023-05-19T15:00:00'),
	(10, "Gardiennage", 'L', '2023-05-20T08:00:00', '2023-05-20T16:00:00'),

	(11, "Nettoyage", 'H', '2023-05-16T08:00:00', '2023-05-16T16:00:00'),
	(12, "Nettoyage", 'H', '2023-05-17T08:00:00', '2023-05-17T16:00:00'),
	(13, "Nettoyage", 'L', '2023-05-18T08:00:00', '2023-05-18T16:00:00'),
	(14, "Nettoyage", 'L', '2023-05-19T08:00:00', '2023-05-19T15:00:00'),
	(15, "Nettoyage", 'L', '2023-05-22T08:00:00', '2023-05-22T16:00:00'),
	(16, "Nettoyage", 'D', '2023-05-23T08:00:00', '2023-05-23T16:00:00'),
	(19, "Nettoyage", 'L', '2023-05-24T08:00:00', '2023-05-24T16:00:00'),
	(20, "Nettoyage", 'D', '2023-05-25T08:00:00', '2023-05-25T16:00:00'),
	(18, "Nettoyage", 'H', '2023-05-15T08:00:00', '2023-05-15T16:00:00'),

	(17, "Réunion", NULL, '2023-05-19T15:00:00', '2023-05-19T16:00:00'),
	(21, "Réunion", NULL, '2023-05-26T15:00:00', '2023-05-26T16:00:00');


INSERT IGNORE INTO Schedule_Spot (id_schedule, id_spot) VALUES
-- H
	(11,1),
	(11,2),
	(11,3),
	(11,4),
	(11,5),

	(12,21),
	(12,22),
	(12,23),
	(12,24),
	(12,25),

	(18,31),
	(18,32),
	(18,33),
	(18,34),
	(18,35),

-- L

	(13,47),
	(13,48),
	(13,49),
	(13,50),
	(13,51),

	(14,52),
	(14,53),
	(14,54),
	(14,55),
	(14,56),

	(15,62),
	(15,63),
	(15,64),
	(15,65),
	(15,66),

	(19,57),
	(19,58),
	(19,59),
	(19,60),
	(19,61),
	(19,62),
	(19,63),

-- D

	(16,77),
	(16,78),
	(16,79),
	(16,80),
	(16,81),

	(20,85),
	(20,86),
	(20,87),
	(20,88),
	(20,89);

INSERT IGNORE INTO User_Schedule (id_user, id_schedule, is_guest) VALUES
	(2,1,0),
	(2,2,0),
	(2,3,0),
	(2,4,0),
	(2,5,0),
	(2,6,0),
	(3,7,0),
	(3,8,0),
	(3,9,0),
	(3,10,0),
	(4,11,0),
	(4,12,0),
	(4,13,0),
	(4,14,0),
	(4,15,0),
	(4,16,0),
	(4,19,0),
	(4,20,0),
	(1,17,0),
	(2,17,0),
	(3,17,1),
	(4,17,1),
	(4,18,0);

INSERT IGNORE INTO Type (name) VALUES
	("Abonné"),
	("Handicapée"),
	("Électrique"),
	("Urgence"),
	("Municipale");

INSERT IGNORE INTO Typed (id_spot, name_type) VALUES
	--
		-- les 8 premieres places
			-- de chaque etage
				-- de chaque parking
					-- sont abonnés
						--
	(1, 'Abonné'),
	(2, 'Abonné'),
	(3, 'Abonné'),
	(4, 'Abonné'),
	(5, 'Abonné'),
	(6, 'Abonné'),
	(7, 'Abonné'),
	(8, 'Abonné'),
	(16, 'Abonné'),
	(17, 'Abonné'),
	(18, 'Abonné'),
	(19, 'Abonné'),
	(20, 'Abonné'),
	(21, 'Abonné'),
	(22, 'Abonné'),
	(23, 'Abonné'),
	(24, 'Abonné'),
	(31, 'Abonné'),
	(32, 'Abonné'),
	(33, 'Abonné'),
	(34, 'Abonné'),
	(35, 'Abonné'),
	(36, 'Abonné'),
	(37, 'Abonné'),
	(38, 'Abonné'),
	(39, 'Abonné'),
	(46, 'Abonné'),
	(47, 'Abonné'),
	(48, 'Abonné'),
	(49, 'Abonné'),
	(50, 'Abonné'),
	(51, 'Abonné'),
	(52, 'Abonné'),
	(53, 'Abonné'),
	(54, 'Abonné'),
	(61, 'Abonné'),
	(62, 'Abonné'),
	(63, 'Abonné'),
	(64, 'Abonné'),
	(65, 'Abonné'),
	(66, 'Abonné'),
	(67, 'Abonné'),
	(68, 'Abonné'),
	(69, 'Abonné'),
	(76, 'Abonné'),
	(76, 'Abonné'),
	(76, 'Abonné'),
	(76, 'Abonné'),
	(80, 'Abonné'),
	(81, 'Abonné'),
	(82, 'Abonné'),
	(83, 'Abonné'),
	(84, 'Abonné'),
	(91, 'Abonné'),
	(92, 'Abonné'),
	(93, 'Abonné'),
	(94, 'Abonné'),
	(95, 'Abonné'),
	(96, 'Abonné'),
	(97, 'Abonné'),
	(98, 'Abonné'),
	(99, 'Abonné'),
	(106, 'Abonné'),
	(107, 'Abonné'),
	(108, 'Abonné'),
	(109, 'Abonné'),
	(110, 'Abonné'),
	(111, 'Abonné'),
	(112, 'Abonné'),
	(113, 'Abonné'),
	(114, 'Abonné'),

	--
		-- les deux dernieres places
			-- de l'étage zéro
				-- de chaque parking
					-- sont 'urgence'
						--
	(14, 'Urgence'),
	(15, 'Urgence'),
	(59, 'Urgence'),
	(60, 'Urgence'),
	(89, 'Urgence'),
	(90, 'Urgence'),

	--
		-- la deuxieme place abonné
			-- de chaque étage
				-- de chaque parking
					-- est éléctrique
						-- ATTENTION
							-- si le parking a moins de trois étages
								-- alors les deux premières places abonnés
									-- de chaque étage
										-- sont électriques
											--
	(2, 'Électrique'),
	(17, 'Électrique'),
	(32, 'Électrique'),
	(46, 'Électrique'),
	(47, 'Électrique'),
	(61, 'Électrique'),
	(62, 'Électrique'),
	(77, 'Électrique'),
	(92, 'Électrique'),
	(107, 'Électrique'),

	--
		-- les trois première places
			-- non abonné
				-- de l'étage 0
					-- de chaque parking
						-- sont municipales
							--
	(9, 'Municipale'),
	(10, 'Municipale'),
	(11, 'Municipale'),
	(55, 'Municipale'),
	(56, 'Municipale'),
	(57, 'Municipale'),
	(85, 'Municipale'),
	(86, 'Municipale'),
	(87, 'Municipale'),

	--
		-- les trois dernières places
			-- de chaque parking
				-- sont handicapés
					--

	(43, 'Handicapée'),
	(44, 'Handicapée'),
	(45, 'Handicapée'),
	(73, 'Handicapée'),
	(74, 'Handicapée'),
	(75, 'Handicapée'),
	(118, 'Handicapée'),
	(119, 'Handicapée'),
	(120, 'Handicapée'),

INSERT IGNORE INTO Notification (id, id_user, action, type_notif, id_schedule) VALUES
	(1,4,"POST","Réunion", 15),
	(2,4,"POST", "Nettoyage", 16),
	(3,5,"POST", "Place temporaire", NULL);
