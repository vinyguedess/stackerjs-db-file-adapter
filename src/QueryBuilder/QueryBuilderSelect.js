import _ from "lodash";
import { QueryBuilderQueries } from "./QueryBuilderQueries";


export class QueryBuilderSelect extends QueryBuilderQueries
{

    constructor()
    {
        super();
        this.fields = [];
        this._limit;
        this._offset;
        this._order;
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

    order()
    {
        if (!this._order)
            this._order = [[], []];

        _.forEach(_.map(_.keys(arguments), key => arguments[key]), rule => 
        {
            if (!Array.isArray(rule))
                rule = [rule, "ASC"];

            this._order[0] = _.concat(this._order[0], rule[0]);
            this._order[1] = _.concat(this._order[1], rule[1]);
        });

        return this;
    }

    parse()
    {
        return {
            type: "LIST",
            at: this.collection,
            fields: this.fields.length ? this.fields : null,
            filters: this._where,
            order: this._order,
            limit: this._limit,
            offset: this._offset
        };
    }

}