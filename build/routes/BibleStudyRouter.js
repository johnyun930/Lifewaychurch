"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.upload = exports.IsNotice = void 0;
var express_1 = __importDefault(require("express"));
var PostSchema_1 = require("../schemas/PostSchema");
var multer_1 = __importDefault(require("multer"));
var ReviewSchema_1 = require("../schemas/ReviewSchema");
var IsNotice;
(function (IsNotice) {
    IsNotice["false"] = "0";
    IsNotice["true"] = "1";
})(IsNotice = exports.IsNotice || (exports.IsNotice = {}));
var storage = multer_1.default.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "public/biblestudy");
    },
    filename: function (req, file, callback) {
        console.log(req.body);
        callback(null, "" + (Date.now() + file.originalname));
    }
});
exports.upload = multer_1.default({ storage: storage, limits: {
        files: 1,
        fileSize: 1024 * 1024 * 3
    } }).single('file');
exports.router = express_1.default.Router();
exports.router.route('/')
    .get(function (req, res) {
    PostSchema_1.BibleStudy.find(function (err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(docs);
        }
    });
})
    .post(function (req, res) {
    exports.upload(req, res, function (err) {
        if (err instanceof multer_1.default.MulterError) {
            res.send({ error: "File is too big. 1MB is Maximum" });
            return;
            // A Multer error occurred when uploading.
        }
        ;
        var _a = req.body, title = _a.title, context = _a.context, composer = _a.composer, notice = _a.notice, bibleText = _a.bibleText;
        var date = new Date();
        var file;
        if (req.file) {
            var file_1 = req.file.path;
        }
        var isnotice = false;
        if (notice === IsNotice.true) {
            isnotice = true;
        }
        var id = 1;
        PostSchema_1.BibleStudy.find(function (err, docs) {
            if (docs.length !== 0) {
                id = docs[0].id + 1;
                console.log(id);
            }
            var post = new PostSchema_1.BibleStudy({
                id: id,
                title: title,
                bibleText: bibleText,
                date: date,
                composer: composer,
                context: context,
                notice: isnotice,
                file: file
            });
            post.save().then(function () {
                res.send([]);
            });
        }).sort({ id: -1 }).limit(1);
    });
}).patch(function (req, res) {
    var _a = req.body, Id = _a.Id, title = _a.title, bibleText = _a.bibleText, context = _a.context;
    console.log(Id);
    PostSchema_1.BibleStudy.findByIdAndUpdate(Id, { title: title, bibleText: bibleText, context: context }, { returnOriginal: false }, function (err, doc) {
        if (err) {
            res.send({ errMessage: "Sorry, fail to update. Please try again" });
        }
        else {
            res.send(doc);
        }
    });
});
exports.router.route('/:id').
    get(function (req, res) {
    PostSchema_1.BibleStudy.findById(req.params.id, function (err, doc) {
        res.send(doc);
    });
})
    .delete(function (req, res) {
    console.log("deleting");
    PostSchema_1.BibleStudy.findByIdAndDelete(req.params.id).then(function () {
        ReviewSchema_1.BibleStudyReview.deleteMany({ postingId: req.params.id }, undefined, function (err) {
            if (err) {
                console.log("Fail to delete the all review of the post");
            }
            else {
                res.send({ message: "Successfully deleted" });
            }
        });
    }).catch(function (err) {
        if (err) {
            res.send({ errMessage: "Fail to delete post Try Aagin" });
        }
    });
});
exports.router.route('/review')
    .post(function (req, res) {
    var _a = req.body, postingId = _a.postingId, reviewer = _a.reviewer, comment = _a.comment;
    var date = new Date();
    var review = new ReviewSchema_1.BibleStudyReview({
        postingId: postingId,
        reviewer: reviewer,
        comment: comment,
        date: date
    });
    review.save(function (err, doc) {
        if (err) {
            res.send({ errMessage: "Sorry. Please Try Again" });
        }
        else {
            res.send(doc);
        }
    });
}).patch(function (req, res) {
    var _a = req.body, _id = _a._id, comment = _a.comment;
    ReviewSchema_1.BibleStudyReview.findByIdAndUpdate(_id, { comment: comment }, { returnOriginal: false }, function (err, doc) {
        if (err) {
            res.send({ errMessage: "Sorry, fail to update. Please try again" });
        }
        else {
            console.log("patching");
            res.send(doc);
        }
    });
});
exports.router.route("/review/:Id")
    .get(function (req, res) {
    ReviewSchema_1.BibleStudyReview.find({ postingId: req.params.Id }, function (err, doc) {
        res.send(doc);
    });
})
    .delete(function (req, res) {
    ReviewSchema_1.BibleStudyReview.findByIdAndDelete(req.params.Id, null, function (err) {
        if (err) {
            res.send({ errMessage: "Sorry, fail to delete. Try again" });
        }
        else {
            res.send();
        }
    });
});
