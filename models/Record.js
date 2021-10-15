const { model, Schema } = require('mongoose');

const recordSchema = new Schema({
    username: String,
    amount: Number,
    use: String,
    comments: String,
    date: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = model('Record', recordSchema);