import { expect } from 'chai';
import * as adapter from './../../lib/adapter';


describe('AdapterTest', () => 
{

    let COLLECTION = 'contacts',
        LAST_INSERTED_ID, 
        ATTRIBUTES = {
            'name': 'Vinicius Guedes',
            'birthday': new Date('1992-12-30 08:25:01'),
            'age': 25,
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
                    { 'name': 'Rafael Ali', 'age': 22, 'active': true },
                    { 'name': 'Joabe Santos', 'age': 28, 'active': true },
                    { 'name': 'Monique', 'age': 21, 'active': false }
                ]
            })
            .then(response => {
                expect(response).to.have.property('lastInsertedId');
                expect(response).to.have.property('affectedRows');
                expect(response).to.have.property('changedRows');
                expect(response.affectedRows).to.be.equal(3);
            })
            .then(() => done());
        });
    });

    describe('Finding and Counting rows from Collection', () => 
    {
        it('Should find only one register', done => 
        {
            adapter.findOne({ 'collection': COLLECTION, 'criteria': { 'id': LAST_INSERTED_ID } })
                .then(attributes => expect(attributes.id).to.be.equal(LAST_INSERTED_ID))
                .then(() => done());
        });

        it('Should find a bunch of registers', done => 
        {
            adapter.findAll({ 'collection': COLLECTION })
                .then(results => {
                    expect(results).to.be.an("array");
                    expect(results.length).to.be.equal(4);
                })
                .then(() => done());
        });

        it('Should find a bunch of registers filtered', done => 
        {
            adapter.findAll({ 
                'collection': COLLECTION, 
                'criteria': {
                    'birthday': { 
                        'gte': new Date('1992-12-30')
                    }
                } 
            })
            .then(results => {
                expect(results).to.be.an('Array');
                expect(results.length).to.be.equal(1);
            })
            .then(() => done());
        });

        it('Should count registers', done => 
        {
            adapter.count({
                'collection': COLLECTION,
                'criteria': {
                    'active': { 'neq': false }
                }
            })
            .then(result => expect(result).to.be.equal(3))
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

    describe('Deleting rows from Collection', () => 
    {
        it('Should delete a register', done => 
        {
            adapter.delete({
                'collection': COLLECTION,
                'criteria': {
                    'age': { 'lt': 25 }
                }
            })
            .then(results => {
                expect(results).to.have.property('affectedRows');
                expect(results).to.have.property('changedRows');
                expect(results).to.have.property('lastInsertedId');
                expect(results.affectedRows).to.be.equal(2);
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