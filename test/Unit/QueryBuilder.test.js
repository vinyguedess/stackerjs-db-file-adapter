import { expect } from "chai";
import { QueryBuilder } from "./../../src";


describe("Test/Unit/QueryBuilderTest", () => 
{

    describe("InsertQueryBuilder", () => 
    {
        it("Should insert data", done => 
        {
            new QueryBuilder()
                .insert()
                .set({ 
                    name: "Any compromise I might have",
                    schedule: "2018-05-26 20:01:32",
                    with: [
                        "Fulano",
                        "Ciclano"
                    ]
                })
                .into("schedules")
                .execute()
                .then(result => 
                {
                    expect(result.lastInsertedId).to.be.a("string");
                    expect(result.affectedRows).to.be.a("number").equals(0);
                    expect(result.changedRows).to.be.a("number").equals(0);
                })
                .finally(done);
        });
    });

});