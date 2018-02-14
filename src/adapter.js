import * as utils from './utils';


let CONN = {
    'database': process.cwd() + '/storage/database'
};


exports.connect = (database) =>
    CONN.database = database;


exports.create = query =>
    utils.hasCollection(query.name)
        .then(response => {
            if (response)
                throw new Error('Collection already exists');
                
            return utils.persistCollection(CONN.database, {
                'name': query.collection,
                'data': []
            });
        });


exports.insert = query =>
    utils.loadCollection(CONN.database, query.collection)
        .then(collection => {
            console.log(this);
            let { attributes } = query;
            if (!attributes)
                throw new Error('Attributes sent in the wrong way');

            attributes['id'] = utils.generateId();
            collection.data.push(attributes);

            return utils.persistCollection(CONN.database, collection)
                .then(response => {
                    return {
                        'lastInsertedId': attributes['id'],
                        'affectedRows': 1,
                        'changedRows': 1
                    }
                }); 
        });


exports.insertMultiple = query =>
    "OK";


exports.update = query =>
    utils.loadCollection(CONN.database, query.collection)
        .then(collection => {
            let { attributes } = query;
            if (!attributes)
                throw new Error('Attributes were not sent');

            let result = { 'lastInsertedId': null, 'affectedRows': 0, 'changedRows': 0 }
            collection.data.map(item => {
                if (utils.parseCriteria(query.criteria)) {
                    result.affectedRows++;
                    result.changedRows++;
                    return Object.assign(item, attributes);
                }

                return item;
            });

            return utils.persistCollection(CONN.database, collection)
                .then(() => {
                    return result;
                });
        });


exports.findById = query => 
    utils.loadCollection(CONN.database, query.collection)
        .then(collection => collection.data.filter(item => item.id === query.criteria))
        .then(([ result ]) => {
            if (!result)
                return null;

            return result;
        });


exports.drop = query =>
    utils.deleteCollection(CONN.database, query.collection);