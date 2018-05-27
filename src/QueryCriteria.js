export class QueryCriteria 
{
    like(field, value) 
    {
        return field.includes(value);
    }

    eq(field, value) 
    {
        return field === value;
    }

    neq(field, value) 
    {
        return field !== value;
    }

    lt(field, value)
    {
        return field < value;
    }

    lte(field, value)
    {
        return field <= value;
    }

    gt(field, value)
    {
        return field > value;
    }

    gte(field, value)
    {
        return field >= value;
    }

    in(field, value)
    {
        return value.includes(field);
    }

    notin(field, value)
    {
        return !value.includes(field);
    }

    // andX()
    // {
    //     return `(${this.intersect(arguments, "AND")})`;
    // }

    // orX()
    // {
    //     return `(${this.intersect(arguments, "OR")})`;
    // }

}
