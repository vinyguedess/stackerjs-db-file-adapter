import { exists, readFile, unlink, writeFile } from "fs";
import * as path from "path";
import _ from "lodash";
import uuid from "uuid/v1";
import { QueryCriteria } from "./QueryCriteria";

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

        if (
            !["ADD", "LIST", "CHANGE", "REMOVE", "DROP", "CREATE"].includes(query.type.toUpperCase())
        )
            throw new Error(`Invalid Query. There's no "${query.type}".`);

        if (!query.at) throw new Error("Invalid Query. Missing \"at\" parameter");
    }

    async execute(query) 
    {
        this.validateQuery(query);

        let { type } = query;
        return this[type.toLowerCase()](query);
    }

    add({ at, data }) 
    {
        if (!Array.isArray(data)) data = [data];

        return this.acquire(at).then(collection => 
        {
            let lastInsertedId;
            data.forEach(item => 
            {
                item.id = lastInsertedId = uuid();
                collection.data.push(item);
            });

            return this.persist(at, collection).then(() => ({
                lastInsertedId,
                affectedRows: 0,
                changedRows: 0
            }));
        });
    }

    list({ at, fields, filters, order, limit, offset }) 
    {
        if (!fields)
            fields = "*";

        return this.acquire(at).then(collection =>
        {
            let results = _.filter(collection.data, this.parseFilters(filters));

            if (Array.isArray(order)) results = _.orderBy(results, order[0], order[1]);

            if (offset) results = _.drop(results, offset);

            if (limit) results = _.take(results, limit);

            return results;
        });
    }

    change({ at, data, filters }) 
    {
        let queryResponse = {
            lastInsertedId: null,
            affectedRows: 0,
            changedRows: 0
        };

        let filter = this.parseFilters(filters);
        return this.acquire(at).then(collection => 
        {
            collection.data = collection.data.map(item => 
            {
                if (!filter(item)) return item;

                queryResponse.affectedRows++;
                let changedItem = { ...item, ...data };

                if (!_.isEqual(item, changedItem)) queryResponse.changedRows++;

                return changedItem;
            });

            return this.persist(at, collection).then(() => queryResponse);
        });
    }

    remove({ at, filters }) 
    {
        let queryResponse = { changedRows: 0, affectedRows: 0 },
            filter = this.parseFilters(filters);

        return this.acquire(at).then(collection => 
        {
            collection.data = collection.data.filter(item => 
            {
                if (!filter(item)) return true;

                queryResponse.affectedRows++;
                return false;
            });

            return this.persist(at, collection).then(() => queryResponse);
        });
    }

    drop({ at }) 
    {
        return new Promise((resolve, reject) => 
        {
            unlink(
                this.getCollectionPath(at),
                err => (err ? reject(err) : resolve(true))
            );
        });
    }

    parseFilters(filters) 
    {
        if (!filters) return () => true;

        if (typeof filters === "function") return filters;

        let criteria = new QueryCriteria();
        return item => 
        {
            let response = true;
            Object.keys(filters).forEach(key => 
            {
                if (!response) return null;

                if (Array.isArray(filters[key])) 
                {
                    let [comp, value] = filters[key];
                    return (response =
                        response &&
                        criteria[comp.toLowerCase()](key, value)(item));
                }

                if (filters[key] && typeof filters[key] === "object")
                    return Object.keys(filters[key]).forEach(comp =>
                        (response =
                                response &&
                                criteria[comp.toLowerCase()](
                                    key,
                                    filters[key][comp]
                                )(item)));

                response = criteria.eq(key, filters[key])(item);
            });

            return response;
        };
    }

    persist(at, collection) 
    {
        return new Promise(resolve => 
        {
            writeFile(
                this.getCollectionPath(at),
                JSON.stringify(collection, null, 4),
                () => resolve(true)
            );
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

                readFile(
                    this.getCollectionPath(at),
                    { encoding: "utf8" },
                    (err, data) => resolve(JSON.parse(data))
                );
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
