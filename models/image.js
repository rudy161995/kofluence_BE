const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    username: {
        type: String
    },
    filename: {
        required: true,
        type: String,
    },
    fileId: {
        required: true,
        type: String,
    },
    createdAt: {
        default: Date.now(),
        type: Date,
    },
    likes:String,
    comments:String,
    date:String
});

const Image = mongoose.model('Image', ImageSchema,"Image");

module.exports = Image;