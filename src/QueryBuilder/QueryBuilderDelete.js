import { QueryBuilderQueries } from "./QueryBuilderQueries";


export class QueryBuilderDelete extends QueryBuilderQueries
{

    parse()
    {
        return {
            type: "REMOVE",
            at: this.collection,
            filters: this._where
        };
    }

}