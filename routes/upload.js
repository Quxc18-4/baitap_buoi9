var express = require("express");
var router = express.Router();
let { uploadImage } = require('../utils/uploadHandler');
let path = require('path');

// Upload 1 file
router.post('/single', uploadImage.single('file'), function (req, res, next) {
    if (!req.file) {
        res.status(404).send({
            message: "file not found"
        });
        return;
    }
    res.send({
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
    });
});

// Upload nhiều file cùng lúc (tối đa 5 file)
router.post('/multiple', uploadImage.array('files', 5), function (req, res, next) {
    if (!req.files) {
        res.status(404).send({
            message: "file not found"
        });
        return;
    }
    let filesInfor = req.files.map(e => {
        return {
            filename: e.filename,
            path: e.path,
            size: e.size
        };
    });
    res.send(filesInfor);
});

// Xem file đã upload
router.get('/:filename', function (req, res, next) {
    let pathFile = path.join(__dirname, '../uploads', req.params.filename);
    res.sendFile(pathFile);
});

module.exports = router;