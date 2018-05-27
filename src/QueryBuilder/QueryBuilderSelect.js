import { QueryBuilderQueries } from "./QueryBuilderQueries";


export class QueryBuilderSelect extends QueryBuilderQueries
{

    constructor()
    {
        super();
        this.fields = [];
        this._limit;
        this._offset;
    }

    set()
    {
        Object.keys(arguments)
            .map(key => arguments[key])
            .forEach(field => this.fields.push(field));

        return this;
    }

    limit(limit)
    {
        this._limit = limit;
        return this;
    }

    offset(offset)
    {
        this._offset = offset;
        return this;
    }

    parse()
    {
        return {
            type: "LIST",
            at: this.collection,
            fields: this.fields.length ? this.fields : null,
            filters: this._where,
            limit: this._limit,
            offset: this._offset
        };
    }

}