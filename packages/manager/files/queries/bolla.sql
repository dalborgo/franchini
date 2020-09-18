CREATE TABLE `bolla` (
                         `id` varchar(50) NOT NULL,
                         `supplier` varchar(10) NOT NULL,
                         `date` varchar(8) NOT NULL,
                         `number` int(11) NOT NULL,
                         `code_art` varchar(50) NOT NULL,
                         `qta` int(11) NOT NULL,
                         `weight` int(11) NOT NULL,
                         `origin` varchar(30) DEFAULT NULL,
                         `processed` tinyint(1) DEFAULT NULL,
                         PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;
