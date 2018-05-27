export class QueryCriteria 
{
    like(field, value) 
    {
        return item => item[field].includes(value);
    }

    eq(field, value) 
    {
        return item => item[field] === value;
    }

    neq(field, value) 
    {
        return item => item[field] !== value;
    }

    lt(field, value)
    {
        return item => item[field] < value;
    }

    lte(field, value)
    {
        return item => item[field] <= value;
    }

    gt(field, value)
    {
        return item => item[field] > value;
    }

    gte(field, value)
    {
        return item => item[field] >= value;
    }

    in(field, value)
    {
        return item => value.includes(item[field]);
    }

    notin(field, value)
    {
        return item => !value.includes(item[field]);
    }

    andX()
    {
        return item =>
        {
            let response = true;
            this.extractFunctions(arguments).forEach(filter => 
            {
                if (!response) return;

                response = filter(item);
            });

            return response;
        };
    }

    orX()
    {
        return item =>
        {
            let response = false;
            this.extractFunctions(arguments).forEach(filter => 
            {
                if (response) return;

                response = filter(item);
            });

            return response;
        };
    }

    extractFunctions(filters)
    {
        return Object.keys(filters).map(key => filters[key]);
    }

}
