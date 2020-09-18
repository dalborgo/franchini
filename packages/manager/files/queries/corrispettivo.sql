CREATE TABLE `corrispettivo` (
                                 `id` varchar(25) NOT NULL COMMENT 'data_numero_riga_mexal',
                                 `id_richiesta` varchar(80) NOT NULL,
                                 `nome_stampante` varchar(100) NOT NULL,
                                 `numero` int(10) DEFAULT NULL,
                                 `data` varchar(8) DEFAULT '',
                                 `ora` varchar(5) DEFAULT '',
                                 `gran_totale` float(15,2) DEFAULT '0.00',
                                 `vendite` float(15,2) DEFAULT '0.00',
                                 `riga_mexal` varchar(15) DEFAULT '',
                                 `riga_mexal_iva` varchar(10) DEFAULT '',
                                 `is_iva` tinyint(1) DEFAULT '0',
                                 `riga_totale` float(15,2) DEFAULT '0.00',
                                 `riga_imponibile` float(15,2) DEFAULT '0.00',
                                 `riga_totale_iva` float(15,2) DEFAULT '0.00',
                                 `processed` tinyint(1) DEFAULT '0',
                                 PRIMARY KEY (`id`,`nome_stampante`,`id_richiesta`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;