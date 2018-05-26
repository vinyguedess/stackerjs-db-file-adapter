import { QueryBuilderInsert } from "./QueryBuilderInsert";


export class QueryBuilder 
{

    insert()
    {
        return new QueryBuilderInsert();
    }

}