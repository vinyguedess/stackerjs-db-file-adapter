import { Connection } from "..";


export class QueryBuilderQueries
{

    constructor()
    {
        this.collection;
        this.fields = {};
        this.where;
    }

    into(collection)
    {
        this.collection = collection;
        return this;
    }

    from(collection)
    {
        this.collection = collection;
        return this;
    }

    set(fields, value)
    {
        if (typeof fields === "object")
            Object.keys(fields)
                .forEach(field => this.set(field, fields[field]));
        else
            this.fields[fields] = value;

        return this;
    }

    where(where)
    {
        this._where = where;
        return this;
    }

    execute()
    {
        return Connection.query(this.parse());
    }

}