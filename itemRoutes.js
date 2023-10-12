const express = require("express");
const items = require("./fakeDb");
const ExpressError = require("./expressError")

const router = new express.Router();

router.get("/", (req, res, next) => {
    return res.json({ items });
});

router.post("/", (req, res, next) => {
    const newItem = { name: req.body.name, price: req.body.price };
    items.push(newItem);
    res.status(201).json({ item: newItem });
});

router.get("/:name", (req, res, next) => {
    try {
        for(let i of items) {
            if(i["name"] == req.params.name) {
                return res.status(200).json(i);
            }
        }
        throw new ExpressError("Item not found.", 404);

    } catch(e) {
        next(e);
    }
});

router.patch("/:name", (req, res, next) => {

    try {
        for(let i of items) {
            if(i["name"] == req.params.name) {
                i["name"] = req.body.name;
                i["price"] = req.body.price;
                return res.status(200).json({updated: i});
            }
        }
        throw new ExpressError("Item not found.", 404);

    } catch(e) {
        next(e);
    }    
});

router.delete("/:name", (req, res, next) => {
    try {
        for(let i = 0; i < items.length; i++) {
            if(items[i]["name"] == req.params.name) {
                items.splice(i, 1);
                return res.status(200).json({message: "Deleted"});
            }
        }
        throw new ExpressError("Item not found.", 404);

    } catch(e) {
        next(e);
    }
});

module.exports = router;