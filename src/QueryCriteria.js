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

    // in(field, value)
    // {
    //     return this.intersectIn(field, value);
    // }

    // notin(field, value)
    // {
    //     return this.intersectIn(field, value, true);
    // }

    // andX()
    // {
    //     return `(${this.intersect(arguments, "AND")})`;
    // }

    // orX()
    // {
    //     return `(${this.intersect(arguments, "OR")})`;
    // }

    // intersect(whatToInsersect, intersectWith)
    // {
    //     return Object.keys(whatToInsersect)
    //         .map(key => whatToInsersect[key])
    //         .join(` ${intersectWith.trim()} `);
    // }

    // intersectIn(field, value, not = false)
    // {
    //     if (Array.isArray(value))
    //         value = `(${value.map(v => treatValue(v)).join(", ")})`;
    //     if (typeof value === "object" && typeof value.parse === "function")
    //         value = treatValue(value);
    //     return `${parseFieldAndTable(field)} ${not ? "NOT" : ""} IN ${value}`;
    // }
}
