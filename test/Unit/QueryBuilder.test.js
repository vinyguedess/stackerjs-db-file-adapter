import { expect } from "chai";
import { QueryBuilder, Connection } from "./../../src";


describe("Test/Unit/QueryBuilderTest", () => 
{

    describe("InsertQueryBuilder", () => 
    {
        it("Should insert data", done => 
        {
            let schedule = new Date();
            schedule.setDate(schedule.getDate() + 1);

            new QueryBuilder()
                .insert()
                .set({ 
                    name: "Any compromise I might have",
                    schedule,
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

    describe("SelectQueryBuilder", () => 
    {
        it("Should select data", done => 
        {
            new QueryBuilder()
                .select()
                .set("id", "name", "with_non_existent")
                .from("schedules")
                .execute()
                .then(results => 
                {
                    expect(results).to.be.an("array");
                    expect(results.length).to.be.at.least(1);
                    expect(results[0].id).to.be.a("string");
                    expect(results[0].name).to.be.a("string");
                    expect(results[0].with_non_existent).to.be.null;
                })
                .finally(done);
        });
    });

    after(done => 
    {
        Promise.all([
            Connection.query({ type: "DROP", at: "schedules" })
        ]).finally(done);
    });

});