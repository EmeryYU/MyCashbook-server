const { AuthenticationError, UserInputError } = require('apollo-server');

const Record = require('../../models/Record');
const Summary = require('../../models/Summary');
const authCheck = require('../../util/auth-check');

module.exports = {
    Query: {
        //Sort by date (the latest comes first)
        //Default mode
        async getRecords(_, { }, context) {
            const user = authCheck(context);
            try {
                const records = await Record.find({ username: user.username }).sort({ date: -1 });
                return records;
            } catch (err) {
                throw new Error(err);
            }
        },
        //Sort by use (alphabetical order)
        async getRecordsByUse(_, { }, context) {
            const user = authCheck(context);
            try {
                const records = await Record.find({ username: user.username }).sort({ use: 1 });
                return records;
            } catch (err) {
                throw new Error(err);
            }
        },

        //Sort by amount (increasing order)
        async getRecordsByAmountIO(_, { }, context) {
            const user = authCheck(context);
            try {
                const records = await Record.find({ username: user.username }).sort({ amount: 1 });
                return records;
            } catch (err) {
                throw new Error(err);
            }
        },

        //Sort by amount (decreasing order)
        async getRecordsByAmountDO(_, { }, context) {
            const user = authCheck(context);
            try {
                const records = await Record.find({ username: user.username }).sort({ amount: -1 });
                return records;
            } catch (err) {
                throw new Error(err);
            }
        },

        async getSummary(_, { }, context) {
            const user = authCheck(context);
            try {
                const newSummary = new Summary({
                    food: 0,
                    clothing: 0,
                    housing: 0,
                    health: 0,
                    transport: 0,
                    entertainment: 0,
                    other: 0,
                    sum: 0
                });
                var i;
                const food = await Record.find({ username: user.username, use: "food" });
                for (i = 0; i < food.length; i++) {
                    newSummary.food += food[i].amount;
                    newSummary.sum += food[i].amount;
                }
                const clothing = await Record.find({ username: user.username, use: "clothing" });
                for (i = 0; i < clothing.length; i++) {
                    newSummary.clothing += clothing[i].amount;
                    newSummary.sum += clothing[i].amount;
                }
                const housing = await Record.find({ username: user.username, use: "housing" });
                for (i = 0; i < housing.length; i++) {
                    newSummary.housing += housing[i].amount;
                    newSummary.sum += housing[i].amount;
                }
                const health = await Record.find({ username: user.username, use: "health" });
                for (i = 0; i < health.length; i++) {
                    newSummary.health += health[i].amount;
                    newSummary.sum += health[i].amount;
                }
                const transport = await Record.find({ username: user.username, use: "transport" });
                for (i = 0; i < transport.length; i++) {
                    newSummary.transport += transport[i].amount;
                    newSummary.sum += transport[i].amount;
                }
                const entertainment = await Record.find({ username: user.username, use: "entertainment" });
                for (i = 0; i < entertainment.length; i++) {
                    newSummary.entertainment += entertainment[i].amount;
                    newSummary.sum += entertainment[i].amount;
                }
                const other = await Record.find({ username: user.username, use: "other" });
                for (i = 0; i < other.length; i++) {
                    newSummary.other += other[i].amount;
                    newSummary.sum += other[i].amount;
                }
                const summary = await newSummary.save();
                return summary;
            } catch (err) {
                throw new Error(err);
            }
        },
    },
    Mutation: {
        async createRecord(_, { amount, use, date, comments }, context) {
            const user = authCheck(context);

            if (use.trim() === '') {
                throw new Error('Use must not be empty');
            }
            if (amount === 0) {
                throw new Error('Amount should not be 0');
            }
            const regEx = /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/;
            if (!date.match(regEx)) {
                console.log(date)
                throw new Error('A date must be selected');
            }

            const newRecord = new Record({
                username: user.username,
                amount: amount,
                use: use,
                comments: comments,
                date: date,
                user: user.id
            });

            const record = await newRecord.save();

            return record;
        },

        async editRecord(_, { recordId, amount, use, date, comments }, context) {
            const user = authCheck(context);

            if (use.trim() === '') {
                throw new Error('Use must not be empty');
            }
            if (amount === 0) {
                throw new Error('Amount should not be 0');
            }
            const regEx = /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/;
            if (!date.match(regEx)) {
                console.log(date)
                throw new Error('A date must be selected');
            }

            try {
                const record = await Record.findById(recordId);
                if (user.username === record.username) {
                    record.amount = amount;
                    record.use = use;
                    record.comments = comments;
                    record.date = date;
                    await record.save();
                    return 'Record changed successfully';
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } catch (err) {
                throw new Error(err);
            }
        },

        async deleteRecord(_, { recordId }, context) {
            const user = authCheck(context);

            try {
                const record = await Record.findById(recordId);
                if (user.username === record.username) {
                    await record.delete();
                    return 'Record deleted successfully';
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    }
};
