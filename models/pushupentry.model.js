const mongoose = require('mongoose');

const PushupEntrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    pushups: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const PushupEntry = mongoose.model('PushupEntry', PushupEntrySchema);

module.exports = PushupEntry;