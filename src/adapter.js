import * as utils from './utils';


let CONN = {
    'database': null,
    'isConnected': false,
    'options': {
        
    }
};


exports.connect = (database, options = {}) =>
    CONN = Object.assign({}, { 'isConnected': true, database, options });


exports.disconnect = () =>
    CONN = { 'database': null, 'isConnected': false, 'options': {} }


exports.create = query =>
    !exports.isConnected() ? Promise.reject(new Error('Database is not connected')) 
    :
    utils.hasCollection(CONN.database, query.collection)
        .then(response => {
            if (response)
                throw new Error('Collection already exists');
                
            return utils.persistCollection(CONN.database, {
                'name': query.collection,
                'data': []
            });
        });


exports.insert = query =>
    !exports.isConnected() ? Promise.reject(new Error('Database is not connected')) 
    :
    utils.loadCollection(CONN.database, query.collection)
        .then(collection => {
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
    !exports.isConnected() ? Promise.reject(new Error('Database is not connected')) 
    :
    utils.loadCollection(CONN.database, query.collection)
        .then(collection => {
            let { attributes } = query;
            if (!attributes)
                throw new Error('Attributes sent in the wrong way');
            
            let lastInsertedId = null;
            attributes.forEach(item => {
                lastInsertedId = item['id'] = utils.generateId();
                collection.data.push(item);
            });

            return utils.persistCollection(CONN.database, collection)
                .then(response => {
                    return {
                        'lastInsertedId': lastInsertedId,
                        'affectedRows': query.attributes.length,
                        'changedRows': query.attributes.length
                    }
                }); 
        });


exports.update = query =>
    !exports.isConnected() ? Promise.reject(new Error('Database is not connected')) 
    :
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


exports.findOne = query => 
    !exports.isConnected() ? Promise.reject(new Error('Database is not connected')) 
    :
    utils.loadCollection(CONN.database, query.collection)
        .then(collection => collection.data.filter(utils.parseCriteria(query.criteria)))
        .then(([ result ]) => {
            if (!result)
                return null;

            return result;
        });


exports.findAll = query =>
    !exports.isConnected() ? Promise.reject(new Error('Database is not connected')) 
    :
    utils.loadCollection(CONN.database, query.collection)
        .then(collection => collection.data.filter(utils.parseCriteria(query.criteria)))
        .then(results => results);


exports.count = query =>
    !exports.isConnected() ? Promise.reject(new Error('Database is not connected')) 
    :
    utils.loadCollection(CONN.database, query.collection)
        .then(collection => collection.data.filter(utils.parseCriteria(query.criteria)))
        .then(results => results.length);


exports.delete = query =>
    !exports.isConnected() ? Promise.reject(new Error('Database is not connected')) 
        :
    utils.loadCollection(CONN.database, query.collection)
        .then(collection => {
            let result = { 'affectedRows': 0, 'changedRows': 0, 'lastInsertedId': null };
            collection.data = collection.data.filter(item => {
                let filter = utils.parseCriteria(query.criteria);
                if (!filter(item)) {
                    result.affectedRows++;
                    return false;
                }
                
                return true;
            });

            return utils.persistCollection(CONN.database, collection)
                .then(() => result);
        });


exports.drop = query =>
    !exports.isConnected() ? Promise.reject(new Error('Database is not connected')) 
        : 
    utils.deleteCollection(CONN.database, query.collection);


exports.isConnected = () => CONN.isConnected;