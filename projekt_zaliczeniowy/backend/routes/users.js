const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/create',async (req, res) => {
    const {email, password} = req.body
    if(email&&password) {
        const hash = bcrypt.hashSync(password, 1);
        try {
            await req.mongoClient.connect();
            const user = await req.mongoClient.db("tasks").collection('users').findOne({email: email})
            if (!user) {
                await req.mongoClient.db("tasks").collection('users').insertOne({email: email, hash: hash})
                res.status(200).json({message: 'created'})
            } else {
                res.status(400).json({error: 'user already exists'})
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

module.exports = router;