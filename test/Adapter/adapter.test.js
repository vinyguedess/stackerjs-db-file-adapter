import { expect } from 'chai';
import * as adapter from './../../lib/adapter';


describe('AdapterTest', () => 
{

    let COLLECTION = 'contacts',
        LAST_INSERTED_ID, 
        ATTRIBUTES = {
            'name': 'Vinicius Guedes',
            'birthday': new Date('1992-12-30 08:25:01'),
            'active': true
        };
    before(() => adapter.connect(process.cwd()));
    
    describe('Creating Collection', () => 
    {
        it('Should create a collection', done => 
        {
            adapter.create({ 'collection': COLLECTION })
                .then(response => expect(response).to.be.true)
                .then(() => done());
        });
    });

    describe('Inserting rows into Collection', () => 
    {
        it('Should insert a register', done => 
        {
            adapter.insert({
                'collection': COLLECTION,
                'attributes': ATTRIBUTES
            })
            .then(response => {
                expect(response).to.have.property('lastInsertedId');
                expect(response).to.have.property('affectedRows');
                expect(response).to.have.property('changedRows');
                LAST_INSERTED_ID = response.lastInsertedId;
            })
            .then(() => done());
        });

        it('Should insert multiple registers', done => 
        {
            adapter.insertMultiple({
                'collection': COLLECTION,
                'attributes': [
                    { 'name': 'Rafael Ali', 'active': true },
                    { 'name': 'Joabe Santos', 'active': true },
                    { 'name': 'Monique', 'active': false }
                ]
            })
            .then(response => {
                console.log(response);
            })
            .then(() => done());
        });
    });

    describe('Finding rows from Collection', () => 
    {
        it('Should find a row by ID', done => 
        {
            adapter.findById({ 'collection': COLLECTION, 'criteria': LAST_INSERTED_ID })
                .then(attributes => expect(attributes.id).to.be.equal(LAST_INSERTED_ID))
                .then(() => done());
        });
    });

    describe('Updating rows from Collection', () => 
    {
        it('Should update a row', done => 
        {
            adapter.update({
                'collection': COLLECTION,
                'attributes': {
                    'active': false,
                    'another_data_for_testing': true
                },
                'criteria': {
                    'id': LAST_INSERTED_ID
                }
            })
            .then(response => {
                expect(response).to.have.property('lastInsertedId');
                expect(response).to.have.property('affectedRows');
                expect(response).to.have.property('changedRows');
                expect(response.lastInsertedId).to.be.null;
            })
            .then(() => done());
        });
    });

    describe('Dropping Collection', () => 
    {
        it('Should drop a collection', done => 
        {
            adapter.drop({ 'collection': COLLECTION })
                .then(response => expect(response).to.be.true)
                .then(() => done());
        });
    });

});