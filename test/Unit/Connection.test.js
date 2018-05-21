import { expect } from "chai";
import { Connection } from "../../src";


describe("Test/Unit/ConnectionTest", () => 
{

    describe("Validators", () => 
    {
        it("Should validate if action is defined in query", done => 
        {
            Connection.query({
                at: "users",
                data: { name: "any name" }
            })
                .catch(err =>
                    expect(() => 
                    {
                        throw err; 
                    }).to.throw(/Missing "type" parameter/))
                .finally(done);
        });

        it("Should validate if collection is defined in query", done => 
        {
            Connection.query({
                type: "ADD",
                data: { name: "any name" }
            })
                .catch(err => 
                    expect(() => 
                    {
                        throw err; 
                    }).to.throw(/Missing "at" parameter/))
                .finally(done);
        });
    });

    describe("Add", () => 
    {
        it("Should insert data into database", done => 
        {
            Connection.query({
                type: "ADD",
                at: "users",
                data: {
                    name: "Vinicius Guedes",
                    login: "vinyguedess",
                    password: "th4tsmyn3wp4ssw0rd"
                }
            })
                .then(queryResponse => 
                {
                    expect(queryResponse).to.have.property("lastInsertedId");
                    expect(queryResponse).to.have.property("affectedRows");
                    expect(queryResponse).to.have.property("changedRows");
                })
                .finally(done);
        });
    });

    describe("Update", () =>
    {
        it("Should update data without filters", done => 
        {
            Connection.query({
                type: "CHANGE",
                at: "users",
                data: {
                    password: "321@123"
                }
            })
                .then(queryResponse => 
                {
                    expect(queryResponse).to.have.property("lastInsertedId");
                    expect(queryResponse).to.have.property("affectedRows");
                    expect(queryResponse).to.have.property("changedRows");

                    expect(queryResponse.lastInsertedId).to.be.null;
                    expect(queryResponse.affectedRows).to.be.equal(1);
                    expect(queryResponse.changedRows).to.be.equal(1);
                })
                .finally(done);
        });

        it("Should run update query but change nothing", done => 
        {
            Connection.query({
                type: "CHANGE",
                at: "users",
                data: {
                    password: "321@123"
                }
            })
                .then(queryResponse => 
                {
                    expect(queryResponse.lastInsertedId).to.be.null;
                    expect(queryResponse.affectedRows).to.be.equal(1);
                    expect(queryResponse.changedRows).to.be.equal(0);
                })
                .finally(done);
        });
    });

    describe("Drop", () => 
    {
        it("Should drop selected collection", done => 
        {
            Connection.query({
                type: "DROP",
                at: "users"
            })
                .then(queryResponse => expect(queryResponse).to.be.true)
                .then(() => done());
        });
    });
    
    after(() => Connection.disconnect());

});