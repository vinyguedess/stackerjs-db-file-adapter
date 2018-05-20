import { exists, readFile, unlink, writeFile } from "fs";
import * as path from "path";
import _ from "lodash";
import uuid from "uuid/v1";


export class FileAdapter
{

    constructor(host, name)
    {
        this.path = path.resolve(host, name);
    }

    validateQuery(query)
    {
        if (!query.type)
            throw new Error("Invalid Query. Missing \"type\" parameter.");

        if (!["ADD", "GET", "CHANGE", "REMOVE", "DROP", "CREATE"].includes(query.type.toUpperCase()))
            throw new Error(`Invalid Query. There's no "${query.type}".`);

        if (!query.at)
            throw new Error("Invalid Query. Missing \"at\" parameter");
    }

    async execute(query)
    {
        this.validateQuery(query);

        let { type } = query;
        return this[type.toLowerCase()](query);
    }

    add({ at, data })
    {
        return this.acquire(at)
            .then(collection => 
            {
                data.id = uuid();
                collection.data.push(data);
                
                return this.persist(at, collection)
                    .then(() => ({
                        lastInsertedId: data.id,
                        affectedRows: 0,
                        changedRows: 0
                    }));
            });
    }

    change({ at, data, filters })
    {
        let queryResponse = {
            lastInsertedId: null,
            affectedRows: 0,
            changedRows: 0
        };

        return this.acquire(at)
            .then(collection => 
            {
                collection.data = collection.data
                    .filter(this.parseFilters(filters))
                    .map(row => 
                    {
                        queryResponse.affectedRows++;
                        let newRow = { ...row, ...data };

                        if (!_.isEqual(row, newRow))
                            queryResponse.changedRows++;

                        return newRow;
                    });

                return this.persist(at, collection).then(() => queryResponse);
            });
    }

    drop({ at })
    {
        return new Promise((resolve, reject) => 
        {
            unlink(this.getCollectionPath(at), err => err ? reject(err) : resolve(true));
        });
    }

    parseFilters(filters)
    {
        if (!filters)
            return () => true;
    }

    persist(at, collection)
    {
        return new Promise(resolve => 
        {
            writeFile(this.getCollectionPath(at), JSON.stringify(collection, null, 4), () => resolve(true));
        });
    }

    acquire(at)
    {
        return new Promise(resolve => 
        {
            exists(this.getCollectionPath(at), existsCollection => 
            {
                if (!existsCollection)
                    return resolve(FileAdapter.buildCollection(at));
                
                readFile(this.getCollectionPath(at), { encoding: "utf8" }, (err, data) => resolve(JSON.parse(data)));
            });
        });
    }

    getCollectionPath(at)
    {
        return `${this.path}/${at}.json`;
    }

}

FileAdapter.buildCollection = (name, rules = {}) => 
{
    return {
        name,
        rules: rules,
        data: []
    };
};