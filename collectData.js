const sqlite = require('sqlite')
const path = require('path')
const randomColor = require('randomcolor')

// initialize database for first run
const initDb = async function(appDb){
    let initProjectsQuery =`CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT ,
        name TEXT ,
        color TEXT ,
        createdDateTime Text ,
        lastKnownRev INT )`
    await appDb.run(initProjectsQuery)
     let initUserQuery =`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT ,
        computerName TEXT ,
        color TEXT  )`
     return  await appDb.run(initUserQuery)
     
}

const getProjects = async function(multieUserPath , appDb){
let dbProjects =  await sqlite.open(path.join(multieUserPath,'/db','/projects.db'))
let query = `SELECT * FROM Projects `;
var projects = await dbProjects.all(query);
const getProjectsPromis = projects.map(async(project)=>{
    let query = `SELECT name FROM projects WHERE name = "${project.ProjectName}"`
    let exist = await appDb.get(query)
    if(!exist){
        //{"name":"Decospan Backzone PLC2 online_V15.1","createdBy":"Ceratec","created":"2019-02-07T09:32:44.4254918Z","lastModifiedBy":"Ceratec","lastModified":"2019-06-03T15:17:46.3905096Z","comment":"Initial upload","disabled":false,"projectVersion":"15.1.0.0","enableCommissioning":false,"enableDivergentData":true}
        let projectJson = JSON.parse(project.Json)
        let insertQuery = `INSERT INTO projects (name ,color , createdDateTime, lastKnownRev) 
        VALUES ('${project.ProjectName}' , '${randomColor()}' , '${projectJson.created}' , 0 )`
        return await appDb.run(insertQuery)
        
    } 
    else {
        return exist
    }

})
return await Promise.all(getProjectsPromis );

}

const appProjectsData = async function (multieUserPath,appDb){
    let query = `SELECT name FROM projects `;
    var projects = await appDb.all(query);
    for ( let project of projects){
        await projectUsers(multieUserPath , project.name , appDb)
    }
    return Promise.resolve()
}
const projectUsers  = async function (multieUserPath,projectName , appDb){
    let dbUsers =  await sqlite.open(path.join(multieUserPath,'proj',projectName,'db','workspace.db'))
    let query = `SELECT DISTINCT MachineName FROM Workspace WHERE MachineName IS NOT NULL AND MachineName != "" `;
    let users= await dbUsers.all(query);
    for ( let user of users){
        let query = `SELECT computerName FROM users WHERE computerName = "${user.MachineName}"`
        let exist = await appDb.get(query)
        if(!exist){
            let insertQuery = `INSERT INTO users (computerName ,color) 
            VALUES ('${user.MachineName}' , '${randomColor()}'  )`
            console.log(user)
             await appDb.run(insertQuery)
            
        }
        

    }
    return Promise.resolve();
   

    
 
}

const projectRevisions = async function (multieUserPath,projectName , appDb){

}

const main = async function() {

const appDb = await sqlite.open('./app.db')
const multieUserDefaultPath = './testData'

await initDb(appDb)
await getProjects(multieUserDefaultPath, appDb)
await appProjectsData(multieUserDefaultPath, appDb)
let query = `SELECT * FROM users `;
var projects = await appDb.all(query);
console.log(projects)

}

main()