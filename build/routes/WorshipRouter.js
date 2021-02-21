"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = __importDefault(require("express"));
var WorshipSchema_1 = require("../schemas/WorshipSchema");
exports.router = express_1.default.Router();
exports.router.route('/')
    .get(function (req, res) {
    console.log("service route working");
    WorshipSchema_1.Worship.find({}, function (err, doc) {
        res.send(JSON.stringify(doc));
    });
}).post(function (req, res) {
    var _a = req.body, title = _a.title, offering = _a.offering, prayer = _a.prayer, startingHymm = _a.startingHymm, bibleText = _a.bibleText, context = _a.context, videoURL = _a.videoURL, endingHymm = _a.endingHymm;
    var date = new Date();
    var service = new WorshipSchema_1.Worship({
        title: title,
        date: date,
        prayer: prayer,
        offering: offering,
        startingHymm: startingHymm,
        bibleText: bibleText,
        context: context,
        videoURL: videoURL,
        endingHymm: endingHymm
    });
    service.save().then(function (result) {
        res.redirect('http://localhost:3000/worship');
    }).catch(function (err) {
        console.log(err);
    });
});
exports.router.get('/:id', function (req, res) {
    WorshipSchema_1.Worship.findById(req.params.id, function (err, doc) {
        res.send(JSON.stringify(doc));
    });
});
