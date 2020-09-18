CREATE TABLE `num_bolla_fornitore` (
                                       `mexal` varchar(100) NOT NULL,
                                       `nbolla` int(11) DEFAULT NULL,
                                       `address` varchar(100) DEFAULT NULL,
                                       `boat` varchar(100) DEFAULT NULL,
                                       `cap` varchar(10) DEFAULT NULL,
                                       `city` varchar(100) DEFAULT NULL,
                                       `license` varchar(100) DEFAULT NULL,
                                       `long_name` varchar(100) DEFAULT NULL,
                                       `phone` varchar(30) DEFAULT NULL,
                                       `prov` varchar(10) DEFAULT NULL,
                                       `short_name` varchar(50) DEFAULT NULL,
                                       `vat` varchar(30) DEFAULT NULL,
                                       `year` int(4) DEFAULT NULL,
                                       PRIMARY KEY (`mexal`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;