const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
const {ObjectId} = require('mongodb')
router.post('/create',async (req, res) => {
    if(req.auth.state) {
        const {content, title, date} = req.body
        if (content && title && date) {
            try {
                await req.mongoClient.connect();
                const note = await req.mongoClient.db("tasks").collection('notes').insertOne({
                    content: content,
                    title: title,
                    date: date,
                    author: req.auth.user._id
                })
                res.status(200).json({message: "Created",data:{
                        content: content,
                        title: title,
                        date: date,
                        author: req.auth.user._id,
                        _id: note.insertedId
                    }})
                console.log(note)
            } catch (e) {
                res.status(500).json({error: e.message})
            } finally {
                await req.mongoClient.close();
            }
        } else {
            res.status(400).json({error: 'Provide params'})
        }
    }
    else{
        res.status(403).json({error: 'forbiden'})
    }
})

router.get('/list', async (req,res)=>{
    if(req.auth.state){
        try {
            await req.mongoClient.connect();
            const cursor = await req.mongoClient.db("tasks").collection('notes').find({author: req.auth.user._id})
            const notes = []
            for await (const doc of cursor) {
                notes.push(doc)
            }
            res.status(200).json({message:"found",data:notes})

        } catch (e) {
            console.log(e)
            res.status(500).json({error: e})
        } finally {
            await req.mongoClient.close();
        }
    }
})

router.delete('/delete',async (req, res) => {
    if(req.auth.state) {
        const {_id} = req.body
        if (_id) {
            try {
                await req.mongoClient.connect();
                const note = await req.mongoClient.db("tasks").collection('notes').deleteOne({
                    _id: new ObjectId(_id)
                })
                res.status(200).json({message: "deleted"})
                console.log(note)
            } catch (e) {
                res.status(500).json({error: e.message})
            } finally {
                await req.mongoClient.close();
            }
        } else {
            res.status(400).json({error: 'Provide params'})
        }
    }
    else{
        res.status(403).json({error: 'forbiden'})
    }
})
router.patch('/modify',async (req, res) => {
    if(req.auth.state) {
        const {content, title, date,_id} = req.body
        if (content && title && date&&_id) {
            try {
                await req.mongoClient.connect();
                const note = await req.mongoClient.db("tasks").collection('notes').updateOne({
                    _id: new ObjectId(_id)
                },{"$set":{
                        content: content,
                        title: title,
                        date: date
                    }})
                res.status(200).json({message: "modified"})
                console.log(note)
            } catch (e) {
                res.status(500).json({error: e.message})
            } finally {
                await req.mongoClient.close();
            }
        } else {
            res.status(400).json({error: 'Provide params'})
        }
    }
    else{
        res.status(403).json({error: 'forbiden'})
    }
})

module.exports = router;