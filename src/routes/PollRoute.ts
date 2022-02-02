import express from "express";
import PollModel from "../models/PollModel";
import {isAuthenticated} from "../middlewares/authMiddleware";

const router = express.Router();

interface IPollAnswers {
    text: string,
    value: string,
    votes: number,
}

interface IPoll {
    creator: string,
    title: string,
    answers: IPollAnswers[],
    totalVotes: number
}

router.get('/', async (req, res) => {
    const polls = await PollModel.find({});
    res.send(polls);
});

router.get('/id/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const poll = await PollModel.findById(id);
        res.send(poll)
    } catch (error) {
        res.send('Invalid ID')
    }
});

router.get('/user', isAuthenticated, async (req, res) => {
    const {username} = res.locals.authenticated;

    try {
        const polls = await PollModel.find({'creator': username});
        res.send(polls);
    } catch (e) {
        res.send('No results');
    }

})

router.post('/new', isAuthenticated, async (req, res) => {
    const answersWithVote = req.body.answers.map((a: IPollAnswers) => {
        return {
            text: a.text,
            value: a.value,
            vote: 0
        }
    });

    const newPoll: IPoll = {
        creator: res.locals.authenticated.username,
        title: req.body.title,
        answers: answersWithVote,
        totalVotes: 0
    }

    try {
        const created = await PollModel.create(newPoll);
        res.send(created);
    } catch (error) {
        res.send({error: 500, errorMessage: "An error occured while trying to create the poll"});
    }
});

router.post('/vote', async (req, res) => {
    const {pollId, answerId} = req.body;
    try {
        const updatedPoll = await PollModel.findOneAndUpdate(
            {
                _id: pollId,
                'answers._id': answerId
            },
            {
                $inc: {
                    totalVotes: 1,
                    'answers.$.vote': 1
                }
            }, {new: true});
        res.send(updatedPoll);
    } catch (error) {
        res.send('An error occured');
    }
});

router.delete('/delete/:id', isAuthenticated, async (req, res) => {
    const {id} = req.params;
    try {
        await PollModel.deleteOne({_id: id, creator: res.locals.authenticated.username});
        res.send(true);
    } catch (error) {
        res.send({error: true, errorMessage: 'An error occurred while trying to delete poll'});
    }
})

export default router;