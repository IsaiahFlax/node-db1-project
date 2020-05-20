const express = require('express');

// database access using knex
const knex = require('../data/dbConfig.js');

const router = express.Router();

// router.get('/', (req, res) => {
//     const sql = knex('posts').then(posts => {res.json(posts)}).catch(err=> {
//         console.log(err)
//         res.json(500).json({err})
//     })
// });

router.get('/', async (req, res) => {
    try {
        const accounts = await knex('accounts')
        res.json(accounts)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
});

router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params
        const accounts = await knex('accounts').where({id})
        if (accounts.length > 0){
            res.json(accounts)
        }
        else {
            res.status(404).json({message: "There is no account with this ID"})
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
});

router.post('/', async (req, res) => {
    const accountData = req.body;
    try {
        if (accountData.name && accountData.budget){
        const numPosts = await knex('accounts').insert(accountData);
        res.status(201).json(numPosts);
        }
        else {
            res.status(400).json({message: "Please add a name and budget"})
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'problem with db', error:err});
    }
});

router.put('/:id', async (req, res) => {
    const accountData = req.body;
    const {id} = req.params
    try {
        if (accountData.name && accountData.budget){
            const numPosts = await knex('accounts').where({id}).update(accountData);
            res.status(201).json(numPosts);
            }
            else {
                res.status(400).json({message: "Please add a name and budget"})
            }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'problem with db', error:err});
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params
        const accounts = await knex('accounts').where({id})
        if (accounts.length > 0){
            await knex('accounts').where('id', `${id}`).del()
            res.status(200).json({message: `DELETED Id ${id}`})
        }
        else {
            res.status(404).json({message: "There is no account with this ID"})
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
});

module.exports = router;