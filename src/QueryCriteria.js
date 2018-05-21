const parseFieldAndTable = field => field;
const treatValue = value => value;

export class QueryCriteria 
{
    like(field, value) 
    {
        value = value.indexOf("%") >= 0 ? value : treatValue(`%${value}%`);
        return `${parseFieldAndTable(field)} LIKE ${value}`;
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
        return `${parseFieldAndTable(field)} < ${treatValue(value)}`;
    }

    lte(field, value) 
    {
        return `${parseFieldAndTable(field)} <= ${treatValue(value)}`;
    }

    gt(field, value) 
    {
        return `${parseFieldAndTable(field)} > ${treatValue(value)}`;
    }

    gte(field, value) 
    {
        return `${parseFieldAndTable(field)} >= ${treatValue(value)}`;
    }

    in(field, value) 
    {
        return this.intersectIn(field, value);
    }

    notin(field, value) 
    {
        return this.intersectIn(field, value, true);
    }

    andX() 
    {
        return `(${this.intersect(arguments, "AND")})`;
    }

    orX() 
    {
        return `(${this.intersect(arguments, "OR")})`;
    }

    intersect(whatToInsersect, intersectWith) 
    {
        return Object.keys(whatToInsersect)
            .map(key => whatToInsersect[key])
            .join(` ${intersectWith.trim()} `);
    }

    intersectIn(field, value, not = false) 
    {
        if (Array.isArray(value))
            value = `(${value.map(v => treatValue(v)).join(", ")})`;
        if (typeof value === "object" && typeof value.parse === "function")
            value = treatValue(value);
        return `${parseFieldAndTable(field)} ${not ? "NOT" : ""} IN ${value}`;
    }
}
