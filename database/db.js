import {DatabaseSync} from 'node:sqlite'
const db = new DatabaseSync(':memory:')

//Executing sql statements from strings.

db.exec(`
    
    CREATE TABLE articles (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           title TEXT ,
           url TEXT UNIQUE,
           
           content TEXT,
           structured_content TEXT,

           source TEXT, 
           new_source TEXT
    )
    `)

    

    export default db