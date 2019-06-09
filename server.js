const express = require('express')
const bodyParser = require('body-parser')
const Moment = require("moment");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);
const sqlite = require('sqlite')
const app = express()
const port = 3000
const dbPromise = sqlite.open('./app.db')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('body-parser').json());
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/api/revisions/chart', async (req, res) => res.send(await getRevisionsChart()))
app.get('/api/revisions/chart/user/:id', async (req, res) => {
    res.send(await getUserRevisionsChart(req.params.id))
})
app.get('/api/revisions/chart/project/:id', async (req, res) => {
    res.send(await getProjectRevisionsChart(req.params.id))
})
app.get('/api/revisions/activity', async (req, res) => {
    let limit = req.query.limit ? req.query.limit: 50
    res.send(await getActivity(limit))
})
app.get('/api/revisions/activity/user/:id', async (req, res) => {
    let limit = req.query.limit ? req.query.limit: 50
    res.send(await getUserActivity(req.params.id , limit))
})
app.get('/api/revisions/activity/project/:id', async (req, res) => {
    let limit = req.query.limit ? req.query.limit: 50
    res.send(await getProjectActivity(req.params.id , limit))
})
app.get('/api/users', async (req, res) => res.send(await getUsers()))
app.get('/api/projects', async (req, res) => res.send(await getProjects()))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))





const getProjects = async () => {
    const appDb = await dbPromise
    let projectQuery= `SELECT * FROM projects ;`;
    let projects = await appDb.all(projectQuery)
    return projects
}
const getUsers = async () => {
    const appDb = await dbPromise
    let userQuery= `SELECT * FROM users ;`;
    let users = await appDb.all(userQuery)
    return users
}

const getUserActivity = async (userId , lim) => {
    const appDb = await dbPromise
    let userQuery= `SELECT * FROM revisions WHERE userId == ${userId} ORDER BY dateTime DESC LIMIT ${lim};`;
    let userActivity = await appDb.all(userQuery)
    return userActivity
}
const getProjectActivity = async (projectId , lim) => {
    const appDb = await dbPromise
    let projectQuery= `SELECT * FROM revisions WHERE projectId == ${projectId} ORDER BY dateTime DESC LIMIT ${lim};`;
    let projectActivity = await appDb.all(projectQuery)
    return projectActivity
}

const getActivity = async (lim) => {
    const appDb = await dbPromise
    let projectQuery= `SELECT * FROM revisions ORDER BY dateTime DESC LIMIT ${lim};`;
    let projects = await appDb.all(projectQuery)
    return projects
}
const getRevisionsChart = async () => {
    const appDb = await dbPromise
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

const getUserRevisionsChart = async (userId) => {
    const appDb = await dbPromise
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
WHERE projectId == ${project.id} AND userId == ${userId}
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

const getProjectRevisionsChart = async (projectId) => {
    const appDb = await dbPromise
    let userQuery= `SELECT * FROM users`
    let users = await appDb.all(userQuery)
    let range = moment.range(moment().subtract(1, "year"), moment());
    range = Array.from(range.by("day"));
    let dateArray = range.map(m => m.format("YYYY-MM-DD"));
    //console.log(dateArray);
    let dateObjArray = dateArray.map(dateTime => {
        let obj = {}
        obj.dateTime = dateTime
        obj.users = []
        return obj
    });
    for(let user of users){
    let countQuery = `
SELECT strftime('%Y-%m-%d', dateTime) as dateTime ,COUNT(*) as count FROM revisions
WHERE projectId == ${projectId} AND userId == ${user.id}
GROUP BY strftime('%Y-%m-%d', dateTime);`
var userResult = await appDb.all(countQuery);

        for ( let result of userResult){
            let index = dateObjArray.findIndex((obj => obj.dateTime == result.dateTime))
            if (index > 0){
                let insertObj = {}
                insertObj.id = user.id
                insertObj.color = user.color
                insertObj.count = result.count
                dateObjArray[index].users.push(insertObj)
            }
        


    }
    
}

return dateObjArray
}