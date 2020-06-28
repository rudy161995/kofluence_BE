const express = require('express');
const imageRouter = express.Router();
const mongoose = require('mongoose');
const Image = require('../models/image');
const config = require('../config');
const router = require('express').Router();
var formidable = require('formidable');
const Grid = require('gridfs-stream');

const { DB, PORT } = require("../config");

module.exports = (upload) => {
    const url = DB;
    const connect = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });

    let gfs;

    connect.once('open', () => {
        // initialize stream
        gfs = Grid(connect.db, mongoose.mongo);
        gfs.collection('uploads');
    });

    //To insert a image/vdo in DB

    // imageRouter.route('/').post(upload.single('myfile'), (req, res) => {
    //     try {
    //         console.log(req.body);
    //         // check for existing images
    //         // Image.findOne({ caption: req.body.caption })
    //         //     .then((image) => {
    //         //         console.log(image);
    //         //         if (image) {
    //         //             return res.status(200).json({
    //         //                 success: false,
    //         //                 message: 'Image already exists',
    //         //             });
    //         //         }

    //         let newImage = new Image({
    //             username: "nivi",
    //             filename: req.file.filename,
    //             fileId: req.file.id,
    //             likes: "1K",
    //             comments: "200",
    //             date:"02 June"
    //         });

    //         newImage.save()
    //             .then((image) => {

    //                 res.status(200).json({
    //                     success: true,
    //                     image,
    //                 });
    //             })
    //             .catch(err => res.status(500).json(err));
    //         // })
    //         // .catch(err => res.status(500).json(err));
    //     } catch (err) {
    //         console.log(err);

    //         return res.status(500).json({
    //             message: "Something went wrong!!",
    //             success: false
    //         })
    //     }



    // })


    //get user specific posts
    imageRouter.route('/getuserpost').post(upload.single('myfile'), (req, res) => {
        Image.find({username:req.body.user})
            .then(images => {
                res.status(200).json({
                    success: true,
                    images
                });
            })
            .catch(err => res.status(500).json(err));
    })

    //get similar posts
    imageRouter.route('/getsimilarpost').get(upload.single('myfile'), (req, res) => {
        Image.find()
            .then(images => {
                res.status(200).json({
                    success: true,
                    images
                });
            })
            .catch(err => res.status(500).json(err));
    })

    //get file
    imageRouter.route('/getfile/:filename').get(upload.single('myfile'), (req, res) => {
        gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            // Check if file
            if (!file || file.length === 0) {
                return res.status(404).json({
                    err: 'No file exists'
                });
            }

            // Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        });

    });

    return imageRouter;
}
