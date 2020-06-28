const { Schema, model } = require('mongoose');

const HashTag = new Schema({
    tag: String,
    group: String,
    mandatory: Boolean
});

module.exports = model("hashtag", HashTag,"hashtag");
