const mongoose = require('mongoose');
const Schema = mongoose.Schema();

const ArticleSchema = new Schema({
    title: { type: String, required: true, minLength: 1, trim: true },
    excerpt: { type: String, required: false },
    text: { type: String, required: true },
    comments: [{ body: String, date: Date, required: false }],
    date: { type: Date, required: false, default: Date.now,  },
    status: { type: String, required: false, default: 'published' }
});

module.exports.ArticleSchema = ArticleSchema;
