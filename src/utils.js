import * as fs from 'fs';


exports.generateId = () => 
    `${new Date().getTime()}.${Math.random() * 100}`;


exports.hasCollection = (database, table) =>
    new Promise(resolve => 
        fs.exists(`${database}/${table}`, response => 
            resolve(response)));


exports.loadCollection = (database, table) =>
    new Promise((resolve, reject) => 
        fs.readFile(`${database}/${table}.json`, { 'encoding': 'utf8' }, (err, data) => 
            err ? reject(err) : resolve(JSON.parse(data))));


exports.persistCollection = (database, collection) => 
    new Promise((resolve, reject) => 
        fs.writeFile(
            `${database}/${typeof collection === 'string' ? collection : collection.name}.json`, 
            JSON.stringify(collection), err => err ? reject(err) : resolve(true)));


exports.deleteCollection = (database, collection) =>
    new Promise((resolve, reject) => 
        fs.unlink(`${database}/${collection}.json`, err => 
            err ? reject(err) : resolve(true)));

exports.parseCriteria = criteria => 
{
    if (typeof criteria === 'function')
        return criteria;

    if (typeof criteria === 'object')
        return item => {
            let response = true;
            Object.keys(criteria).forEach(key => {
                if (!response)
                    return;
                    
                if (item[key] !== criteria[key])
                    response = false;
            });

            return response;
        }

    return item => item;
}