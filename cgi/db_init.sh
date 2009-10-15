#!/bin/bash

cp ../cgi-src/sql_webapi/sql_webapi .

sqlite3 user.db 'DROP TABLE skalde;'
sqlite3 user.db 'CREATE TABLE skalde( m_content text, m_author text, m_date int, m_style text, m_id INTEGER PRIMARY KEY AUTOINCREMENT, m_status text, m_x int,  m_y int, m_z int, m_width int, m_height int );'
sqlite3 user.db 'INSERT INTO skalde VALUES ( "Hello World", "guest0", 1211470395, "", 0, "", 100, 100, 1, 100, 50 );'
sqlite3 user.db 'INSERT INTO skalde VALUES ( "Hello World2", "guest1", 1211470529, "", 1, "", -100, -100, 1, 100, 50 );'
sqlite3 user.db 'SELECT * FROM skalde'

chmod a+w user.db
