import { QueryBuilderInsert } from "./QueryBuilderInsert";
import { QueryBuilderSelect } from "./QueryBuilderSelect";
import { QueryBuilderUpdate } from "./QueryBuilderUpdate";
import { QueryBuilderDelete } from "./QueryBuilderDelete";


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

    update()
    {
        return new QueryBuilderUpdate();
    }

    delete()
    {
        return new QueryBuilderDelete();
    }

}