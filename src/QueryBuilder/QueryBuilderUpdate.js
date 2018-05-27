import { QueryBuilderQueries } from "./QueryBuilderQueries";


export class QueryBuilderUpdate extends QueryBuilderQueries
{

    parse()
    {
        return {
            type: "CHANGE",
            at: this.collection,
            data: this.fields,
            filters: this._where
        };
    }

}