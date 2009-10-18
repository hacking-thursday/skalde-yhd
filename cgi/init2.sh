#!/bin/bash

sqlite3 user2.db 'DROP TABLE skalde;'
sqlite3 user2.db 'CREATE TABLE skalde( m_content text, m_author text, m_date int, m_style text, m_id INTEGER PRIMARY KEY AUTOINCREMENT, m_status text, m_x int,  m_y int, m_z int, m_width int, m_height int, UNIQUE( m_author,m_date) );'
sqlite3 user2.db 'INSERT INTO skalde VALUES ( "Hello World", "guest0", 1211470395, "", 0, "", 100, 100, 1, 100, 50 );'
sqlite3 user2.db 'INSERT INTO skalde VALUES ( "Hello World2", "guest1", 1211470529, "", 1, "", -100, -100, 1, 100, 50 );'
sqlite3 user2.db 'INSERT INTO skalde VALUES ( "Hello World2", "guest1", 1211470529, "", 2, "", -100, -100, 1, 100, 50 );'
sqlite3 user2.db 'SELECT * FROM skalde'

chmod a+w user2.db
