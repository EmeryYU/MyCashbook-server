const { model, Schema } = require('mongoose');

const summarySchema = new Schema({
    food: Number,
    clothing: Number,
    housing: Number,
    health: Number,
    transport: Number,
    entertainment: Number,
    other: Number,
    sum: Number
});

module.exports = model('Summary', summarySchema);