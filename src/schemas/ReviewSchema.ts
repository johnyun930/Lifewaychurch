import mongoose,{Document,Schema} from 'mongoose';
export interface IReview extends Document{
    postingId: string;
    reviewer: string,
    comment: string,
    date: Date
}

export const ReviewSchema : Schema = new Schema({
    postingId: {type:String,require:true},
    comment: {type:String,require:true},
    reviewer: {type:String,require:true}
});

export const WorshipReview = mongoose.model<IReview>('worshipReview',ReviewSchema);
export const BibleStudyReview = mongoose.model<IReview>('bibleStudyReview',ReviewSchema);
export const ChildSchoolReview = mongoose.model<IReview>('childSchoolReview',ReviewSchema);
export const QTReview = mongoose.model<IReview>('qtReview',ReviewSchema);
export const BulletenBoardReview = mongoose.model<IReview>('bulletenBoardReview',ReviewSchema);
