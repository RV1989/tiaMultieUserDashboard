const sqlite = require('sqlite')
const path = require('path')
let multieUserDefaultPath = './testData'



const getProjects = async function(multieUserPath){
let dbProjects =  await sqlite.open(path.join(multieUserPath,'/db','/projects.db'))
const db = await sqlite.open('./database.db')
db.run(`CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT , name TEXT`)

var get = `SELECT * FROM Projects `;
var projects = await dbProjects.all(get);
for (let project of projects){
    let query = `SELECT name FROM projects WHERE name = "${project.ProjectName}"`
    let exist = await db.ProjectNameget(query )
    console.log(exist)
}

}

getProjects(multieUserDefaultPath)