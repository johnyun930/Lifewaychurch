"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulletenBoardReview = exports.QTReview = exports.ChildSchoolReview = exports.BibleStudyReview = exports.WorshipReview = exports.ReviewSchema = void 0;
var mongoose_1 = __importStar(require("mongoose"));
exports.ReviewSchema = new mongoose_1.Schema({
    postingId: { type: String, require: true },
    comment: { type: String, require: true },
    reviewer: { type: String, require: true }
});
exports.WorshipReview = mongoose_1.default.model('worshipReview', exports.ReviewSchema);
exports.BibleStudyReview = mongoose_1.default.model('bibleStudyReview', exports.ReviewSchema);
exports.ChildSchoolReview = mongoose_1.default.model('childSchoolReview', exports.ReviewSchema);
exports.QTReview = mongoose_1.default.model('qtReview', exports.ReviewSchema);
exports.BulletenBoardReview = mongoose_1.default.model('bulletenBoardReview', exports.ReviewSchema);
