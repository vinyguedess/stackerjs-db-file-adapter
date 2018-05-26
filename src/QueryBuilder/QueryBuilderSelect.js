import { QueryBuilderQueries } from "./QueryBuilderQueries";


export class QueryBuilderSelect extends QueryBuilderQueries
{

    constructor()
    {
        super();
        this.fields = [];
    }

    set()
    {
        Object.keys(arguments)
            .map(key => arguments[key])
            .forEach(field => this.fields.push(field));

        return this;
    }

    parse()
    {
        let query = {
            type: "LIST",
            at: this.collection,
            fields: this.fields
        };

        return query;
    }

}