process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");
const { describe } = require("node:test");

let pickles = { name: "Pickles", price: 1.45 };
let cheerios = { name: "Cheerios", price: 3.40 };

beforeEach(function() {
    items.push(pickles);
    items.push(cheerios);
})

afterEach(function() {
    items.length = 0;
})

describe("GET, POST, PATCH, DELETE /items", function() {
    test("Gets a list of all items in DB.", async function() {
        const resp = await request(app).get("/items");
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({items: [pickles, cheerios]});
    })

    test("Creates a new item", async function() {
        const testItem = {name: "Pepsi", price: 2.99};
        const resp = await request(app).post("/items").send(testItem)
        
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({item: testItem});
    })

    test("Fetches singular item.", async function() {
        const resp = await request(app).get("/items/Cheerios");

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(cheerios);
    })

    test("Fetches non-existent item.", async function() {
        const resp = await request(app).get("/items/cupcakes");

        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({error: "Item not found."});
    })

    test("Modifies item.", async function() {
        const moddedItem = {name: "Honey Nut Cheerios", price: 3.99};
        const resp = await request(app).patch("/items/Cheerios").send(moddedItem);

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({updated: moddedItem});
    })

    test("Deletes item.", async function() {
        const resp = await request(app).delete("/items/Pickles");

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({message: "Deleted"});
        expect(items.length).toEqual(1);
    })

})