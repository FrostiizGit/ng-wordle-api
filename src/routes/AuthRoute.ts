import express from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";
import PollModel from "../models/PollModel";

const router = express.Router();

interface IUser {
    username: string,
    password: string
}

const JWT_SECRET = 'OmegaPepegTopSecret123';

router.post('/register', async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) return res.send({error: true, errorMessage: 'Invalid username or password'});
    const userFound = await UserModel.findOne({username});
    if (userFound) return res.send('User already exists');
    const hashedPassword = await argon2.hash(password);
    const newUser: IUser = {
        username,
        password: hashedPassword
    }

    const registered = await UserModel.create(newUser);
    const userToken = {
        id: registered._id,
        username,
    }
    const token = jwt.sign(userToken, JWT_SECRET, {algorithm: "HS256"});
    res.send({token});
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) return res.send({error: true, errorMessage: 'Invalid username or password'});

    try {
        const { _id, password: passwordHash} = await UserModel.findOne({'username': username});
        if (await argon2.verify(passwordHash, password)) {
            const userToken = {
                id: _id,
                username,
            }
            const token = jwt.sign(userToken, JWT_SECRET, {algorithm: "HS256"});
            res.send({token});
        } else {
            res.send('Incorrect credentials');
        }
    } catch (err) {
        res.send('Internal error');
    }
});

router.delete('/forgot/:username', async (req, res) => {
    const {username} = req.params;
    try {
        await UserModel.findOneAndDelete({'username': username});
        await PollModel.deleteMany({'creator': username});
        res.send(true);
    } catch (e) {
        res.send(false);
    }
});

export default router;