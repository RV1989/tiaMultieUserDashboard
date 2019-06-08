const express = require('express')
const Moment = require("moment");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);
const sqlite = require('sqlite')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/api/revisionsChart', async (req, res) => res.send(await getChartData()))
app.get('/api/revisionsActivity', async (req, res) => res.send(await getActivity(100)))
app.get('/api/users', async (req, res) => res.send(await getUsers()))
app.get('/api/projects', async (req, res) => res.send(await getProjects()))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
const getProjects = async () => {
    const appDb = await sqlite.open('./app.db')
    let projectQuery= `SELECT * FROM projects ;`;
    
    let projects = await appDb.all(projectQuery)
    return projects
}
const getUsers = async () => {
    const appDb = await sqlite.open('./app.db')
    let projectQuery= `SELECT * FROM users ;`;
    
    let projects = await appDb.all(projectQuery)
    return projects
}
const getActivity = async (lim) => {
    const appDb = await sqlite.open('./app.db')
    let projectQuery= `SELECT * FROM revisions ORDER BY dateTime DESC LIMIT ${lim};`;
    
    let projects = await appDb.all(projectQuery)
    return projects
}
const getChartData = async () => {
    const appDb = await sqlite.open('./app.db')
    let projectQuery= `SELECT * FROM projects`
    let projects = await appDb.all(projectQuery)
    let range = moment.range(moment().subtract(1, "year"), moment());
    range = Array.from(range.by("day"));
    let dateArray = range.map(m => m.format("YYYY-MM-DD"));
    //console.log(dateArray);
    let dateObjArray = dateArray.map(dateTime => {
        let obj = {}
        obj.dateTime = dateTime
        obj.projects = []
        return obj
    });
    for(let project of projects){
    let countQuery = `
SELECT strftime('%Y-%m-%d', dateTime) as dateTime ,COUNT(*) as count FROM revisions
WHERE projectId == ${project.id}
GROUP BY strftime('%Y-%m-%d', dateTime);`
var projectResult = await appDb.all(countQuery);

        for ( let result of projectResult){
            let index = dateObjArray.findIndex((obj => obj.dateTime == result.dateTime))
            if (index > 0){
                let insertObj = {}
                insertObj.id = project.id
                insertObj.color = project.color
                insertObj.count = result.count
                dateObjArray[index].projects.push(insertObj)
            }
        


    }
    
}

return dateObjArray
}