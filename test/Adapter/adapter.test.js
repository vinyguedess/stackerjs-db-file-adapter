import { expect } from 'chai';
import * as adapter from './../../lib/adapter';


describe('AdapterTest', () => 
{
    
    describe('Create table', () => 
    {
        it('Should create database without trouble', done => 
        {
            adapter.create({ 'collection': 'contacts' })
                .then(response => expect(response).to.be.true)
                .then(() => done());
        });
    });

    describe('Inserting', () => 
    {
        it('Should insert a register', done => 
        {
            
            adapter.insert({
                'collection': 'contacts',
                'attributes': {
                    'name': 'Vinicius Guedes',
                    'birthday': new Date('1992-12-30'),
                    'active': true
                }
            })
            .then(response => {
                expect(response).to.have.property('lastInsertedId');
                expect(response).to.have.property('affectedRows');
                expect(response).to.have.property('changedRows');
            })
            .then(() => done());
        });
    });

    describe('Drop table', () => 
    {
        it('Should drop table without problem', done => 
        {
            adapter.drop({ 'collection': 'contacts' })
                .then(response => expect(response).to.be.true)
                .then(() => done());
        });
    });

});