import * as fs from 'fs';


exports.generateId = () => 
    `${new Date().getTime()}.${Math.random() * 100}`;


exports.hasCollection = (database, table) =>
    new Promise(resolve => 
        fs.exists(`${database}/${table}.json`, response => 
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


exports.isValidQuery = (query, validator = [ 'collection' ]) =>
    validator.length === validator.filter(v => typeof query[v] !== 'undefined').length

            
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

                if (typeof criteria[key] === 'object')
                    return Object.keys(criteria[key]).forEach(compareAs => {
                        if (!response)
                            return;

                        response = exports.compare(item[key], compareAs.toLowerCase(), criteria[key][compareAs]);
                    });

                exports.compare(item[key], 'eq', criteria[key]);
            });

            return response;
        }

    return item => true;
}


exports.compare = (field, compareType, value) =>
{
    if (value instanceof Date) {
        field = new Date(field).getTime();
        value = value.getTime();
    }

    if ((compareType === 'eq' || compareType === '=') && field === value)
        return true;

    if ((compareType === 'neq' || compareType === '<>') && field !== value)
        return true;

    if ((compareType === 'gt' || compareType === '>') && field > value)
        return true;

    if ((compareType === 'gte' || compareType === '>=') && field >= value)
        return true;

    if ((compareType === 'lt' || compareType === '<') && field < value)
        return true;

    if ((compareType === 'lte' || compareType === '<=') && field <= value)
        return true;

    if ((compareType === 'like') && field.indexOf(value.replace(/\%/g, '')))
        return true;

    return false;
}