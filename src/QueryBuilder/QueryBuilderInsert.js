import { QueryBuilderQueries } from "./QueryBuilderQueries";


export class QueryBuilderInsert extends QueryBuilderQueries
{

    parse()
    {
        return {
            type: "ADD",
            at: this.collection,
            data: this.fields
        };   
    }

}