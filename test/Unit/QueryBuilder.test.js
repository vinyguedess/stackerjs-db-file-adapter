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
        before(done => 
        {
            Promise.all([
                Connection.query({
                    type: "ADD",
                    at: "schedules",
                    data: [
                        { name: "Do something now", schedule: new Date(), with: [], status: 2 },
                        { name: "My mom gave birth to me", schedule: "1992-12-30 08:25:00", with: [ "Mom", "Dad" ], status: 1 },
                        { name: "Lost", schedule: "2016-07-20 23:00:00", with: [ "Relationship anniversary" ], status: 0 }
                    ]
                }),
                Connection.query({
                    type: "ADD",
                    at: "schedule_statuses",
                    data: [
                        { name: "Forgot", code: 0 },
                        { name: "Done", code: 1 },
                        { name: "Rescheduled", code: 2 },
                        { name: "Cancelled", code: 3 }
                    ]
                })
            ]).finally(done);
        });

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

        describe("Limiting and offseting", () => 
        {
            it("Should limit results", done =>
            {
                new QueryBuilder()
                    .select()
                    .from("schedule_statuses")
                    .limit(2)
                    .execute()
                    .then(results => 
                    {
                        expect(results).to.be.an("array");
                        expect(results).to.be.lengthOf(2);
                    })
                    .finally(done);
            });

            it("Should offset results", done => 
            {
                new QueryBuilder()
                    .select()
                    .from("schedule_statuses")
                    .offset(1)
                    .execute()
                    .then(results => 
                    {
                        expect(results).to.be.lengthOf(3);
                    })
                    .finally(done);
            });

            it("Should limit and offset", done => 
            {
                new QueryBuilder()
                    .select()
                    .from("schedule_statuses")
                    .limit(2)
                    .offset(1)
                    .execute()
                    .then(results => 
                    {
                        expect(results).to.be.lengthOf(2);
                        expect(results[0].name).to.be.equal("Done");
                    })
                    .finally(done);
            });
        });

        describe("Filtering results", () => 
        {
            it("Should filter by equal", done => 
            {
                new QueryBuilder()
                    .select()
                    .from("schedule_statuses")
                    .where({ name: "Done" })
                    .execute()
                    .then(results => expect(results).to.be.lengthOf(1))
                    .finally(done);
            });

            it("Should filter by Greather Than", done => 
            {
                new QueryBuilder()
                    .select()
                    .from("schedule_statuses")
                    .where({ code: { gt: 2 } })
                    .execute()
                    .then(results => expect(results).to.be.lengthOf(1))
                    .finally(done);
            });

            it("Should filter by Greater Than or Equal", done => 
            {
                new QueryBuilder()
                    .select()
                    .from("schedule_statuses")
                    .where({ code: { gte: 2 } })
                    .execute()
                    .then(results => expect(results).to.be.lengthOf(2))
                    .finally(done);
            });

            it("Should filter by Lower Than", done => 
            {
                new QueryBuilder()
                    .select()
                    .from("schedule_statuses")
                    .where({ code: { lt: 3 } })
                    .execute()
                    .then(results => expect(results).to.be.lengthOf(3))
                    .finally(done);
            });

            it("Should filter by Lower Than or Equal", done => 
            {
                new QueryBuilder()
                    .select()
                    .from("schedule_statuses")
                    .where({ code: { lte: 3 } })
                    .execute()
                    .then(results => expect(results).to.be.lengthOf(4))
                    .finally(done);
            });

            it("Should filter by In", done => 
            {
                new QueryBuilder()
                    .select()
                    .from("schedule_statuses")
                    .where({ code: { in: [0, 2, 3] } })
                    .execute()
                    .then(results => expect(results).to.be.lengthOf(3))
                    .finally(done);
            });

            it("Should filter by Not In", done => 
            {
                new QueryBuilder()
                    .select()
                    .from("schedule_statuses")
                    .where({ code: { notin: [0, 1] } })
                    .execute()
                    .then(results => expect(results).to.be.lengthOf(2))
                    .finally(done);
            });
        });
    });

    after(done => 
    {
        Promise.all([
            Connection.query({ type: "DROP", at: "schedules" }),
            Connection.query({ type: "DROP", at: "schedule_statuses" })
        ]).finally(done);
    });

});