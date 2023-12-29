const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');

router.post('/create',async (req, res) => {
    const {email, password} = req.body
    if(email&&password) {
        try {
            await req.mongoClient.connect();
            const user = await req.mongoClient.db("tasks").collection('users').findOne({email: email})
            if (user) {
                console.log(user._id)
                if (bcrypt.compareSync(password, user.hash)) {
                    const code = uuidv4()
                    await req.mongoClient.db("tasks").collection('auth').insertOne({userID: user._id, code: code})
                    res.status(200).json({message: 'created', data: {code: code}})
                } else {
                    res.status(401).json({error: 'Wrong auth'})
                }

            } else {
                res.status(401).json({error: 'Wrong auth'})
            }
        } catch (e) {
            res.status(500).json({error: e.message})
        } finally {
            await req.mongoClient.close();
        }
    }
    else{
        res.status(400).json({error: 'Provide params'})
    }
})
router.delete('/delete',async (req, res) => {
    if (req.auth.state) {
        const code = req.headers['x-code']
        if (code) {
            try {
                await req.mongoClient.connect();
                const auth = await req.mongoClient.db("tasks").collection('auth').findOne({code: code})
                if (auth) {
                    await req.mongoClient.db("tasks").collection('auth').deleteOne({code: code})
                    res.status(200).json({message: 'Removed'})
                } else {
                    res.status(400).json({error: 'Not found'})
                }

            } catch (e) {
                console.log(e)
                res.status(500).json({error: e.message})
            } finally {
                await req.mongoClient.close();
            }
        } else {
            res.status(400).json({error: 'Provide params'})
        }
    }
    else
    {
        res.status(403).json({error: 'forbiden'})
    }
})
router.get('/check',async (req, res) => {
    res.status(200).json(req.auth)
})

module.exports = router;