import mongoose from "mongoose";
const { Schema } = mongoose;

const PollModel = mongoose.model('polls', new Schema({
    creator: String,
    title: String,
    answers: [{
        value: String,
        text: String,
        vote: Number
    }],
    totalVotes: Number,
}));

export default PollModel;