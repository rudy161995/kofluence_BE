const cors = require("cors");
const exp = require("express");
const bp = require("body-parser");
const { connect } = require("mongoose");
const { success, error } = require("consola");

const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const GridFsStorage = require('multer-gridfs-storage');

// Bring in the app constants
const { DB, PORT } = require("./config");

// Initialize the application
const app = exp();

//middlewares
app.use(cors());
app.use(bp.json());

//User Router Middleware
app.use('/api/', require('./routes/hashtag'));


// create storage engine
const storage = new GridFsStorage({
    url: DB,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage });
const imageRouter = require('./routes/image');
app.use('/api/post/', imageRouter(upload));


//connection with db

const startApp = async () => {
    try {
       await connect(DB, {
            useUnifiedTopology: true,
            useFindAndModify: true,
            useNewUrlParser: true
        })
        success({
            message: `Suceessfullly connected to DB \n${DB}`,
            badge: true
        })
        app.listen(PORT, () =>
            success({ message: `Server started on PORT ${PORT}`, badge: true })
        );
    } catch (err) {
        error({
            message: `unable to connect to DB, Trying to reconnect \n${err}`,
            badge: true
        })
        startApp();
    }
};

startApp();
