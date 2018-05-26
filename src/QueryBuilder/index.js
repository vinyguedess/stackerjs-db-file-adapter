import { QueryBuilderInsert } from "./QueryBuilderInsert";
import { QueryBuilderSelect } from "./QueryBuilderSelect";


export class QueryBuilder 
{

    insert()
    {
        return new QueryBuilderInsert();
    }

    select()
    {
        return new QueryBuilderSelect();
    }

}