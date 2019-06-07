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
       await appDb.run(initUserQuery)
     let initRevisionQuery =`CREATE TABLE IF NOT EXISTS revisions (
        id INTEGER PRIMARY KEY AUTOINCREMENT ,
        revision INT ,
        revisionComment TEXT,
        dateTime TEXT,
        userId INT,
        projectId  )`
     return  await appDb.run(initRevisionQuery)
     
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
    let query = `SELECT * FROM projects `;
    var projects = await appDb.all(query);
    for ( let project of projects){
        await projectUsers(multieUserPath , project , appDb)
        await projectRevisions(multieUserPath , project, project.lastKnownRev , appDb)
    }
    return Promise.resolve()
}
const projectUsers  = async function (multieUserPath,project , appDb){
    let dbUsers =  await sqlite.open(path.join(multieUserPath,'proj',project.name,'db','workspace.db'))
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

const projectRevisions = async function (multieUserPath,project, lastRevision , appDb){
    let dbHistory =  await sqlite.open(path.join(multieUserPath,'proj',project.name,'db','history.db'))
    let query = `SELECT * FROM History WHERE Revision > ${lastRevision} `;
    let newHistoryEntrees= await dbHistory.all(query);
    for (let newHistoryEntree of newHistoryEntrees){
        let userId = await getUserIdFromProject(multieUserPath, project.name , newHistoryEntree.WorkspaceId , appDb)
        if (!userId){
            userId = {id:0}
        }
        let revision = newHistoryEntree.Revision
        let revisionCustomData = JSON.parse(newHistoryEntree.CustomData)
        let revisionComment = revisionCustomData.text.replace('"','')
        let revisionDateTime = revisionCustomData.dateTime
        let insertQuery = `INSERT INTO revisions (revision ,revisionComment , dateTime, userId , projectId) 
        VALUES (${revision} , "${revisionComment}" , '${revisionDateTime}' , ${userId.id} , ${project.id} )`
        // {"userName":"Ceratec","dateTime":"2019-02-07T09:32:44.4254918Z","text":"Initial upload","projectVersion":"15.1.0.0","enableCommissionining":null,"enableDivergentData":null}
        await appDb.run(insertQuery)
        let updateQuery = `        
        UPDATE projects
        SET lastKnownRev = ${revision}
        WHERE
         id = ${project.id};`
         await appDb.run(updateQuery)

        
    }

    return Promise.resolve()
    


}

const getUserIdFromProject = async function (multieUserPath ,projectName, workspaceId, appDb){
    let dbUsers =  await sqlite.open(path.join(multieUserPath,'proj',projectName,'db','workspace.db'))
    let query = `SELECT MachineName FROM Workspace WHERE WorkSpaceId == '${workspaceId}' `;
    let user= await dbUsers.get(query);
    let queryApp = `SELECT id FROM users WHERE computerName = "${user.MachineName}"`
    let id = await appDb.get(queryApp)
    return(id)
}



const main = async function() {
const appDb = await sqlite.open('./app.db')
const multieUserDefaultPath = './testData'

await initDb(appDb)
await getProjects(multieUserDefaultPath, appDb)
await appProjectsData(multieUserDefaultPath, appDb)
//select dateofbirth from customer Where DateofBirth  BETWEEN date('1004-01-01') AND date('1980-12-31');

let countQuery = `
SELECT strftime('%Y-%m-%d', dateTime) as date ,COUNT(*) as revs FROM revisions
WHERE projectId == 2
GROUP BY strftime('%Y-%m-%d', dateTime);

`
let query = `SELECT * FROM revisions WHERE dateTime  BETWEEN date('2019-03-04')AND date('2019-03-10')`;
var projects = await appDb.all(countQuery);
console.log(projects)

}

main()