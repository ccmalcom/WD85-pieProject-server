// const express = require('express');
// const router = express.Router(); !same as below

const router = require('express').Router();
const {PieModel} = require('../models');
const middleware = require('../middleware');


// router.get('/', (req, res) => res.send('I love pies!'));

//find all pies
router.get('/', async (req, res) =>{
    try{
        const allPies = await PieModel.findAll();

        res.status(200).json(allPies);
    } catch (err){
        res.status(500).json({
            error: err
        })
    }
});

//find pie by name
router.get('/name/:name', async(req, res)=>{
    try{
        const locatedPie = await PieModel.findOne({
            where: {nameOfPie: req.params.name}
        })
    res.status(200).json({
        message: 'Pies successfully retrieved',
        pie: locatedPie
    })
    } catch(err) {
        res.status(500).json({
            message: `Failed to update pie: ${err}`
        })
    }
})

//make new pie
router.post('/', middleware.validateSession, async(req, res)=>{
    const {
        nameOfPie,
        baseOfPie,
        crust,
        timeToBake,
        servings,
        ratings
    } = req.body;

    try{
        const Pie = await PieModel.create({
            nameOfPie,
            baseOfPie,
            crust,
            timeToBake,
            servings,
            ratings
        });

        res.status(201).json({
            message: 'Pie successfully created',
            Pie
        })
    } catch (err) {
        res.status(500).json({
            message: `Failed to create pie: ${err}`
        })
    }
});

//update pie
router.put('/:id', middleware.validateSession, async(req, res) =>{
    const { nameOfPie, baseOfPie, crust, timeToBake, servings, ratings
    } = req.body;

    try{
        const pieUpdated = await PieModel.update({ nameOfPie, baseOfPie, crust, timeToBake, servings, ratings}, {where: {id: req.params.id}}
        )

        res.status(200).json({
            message: 'Pie successfully updated',
            pieUpdated
        })
    } catch (err) {
        res.status(500).json({
            message: `Failed to update pie: ${err}`
        })

    }
})

// Make delete endpoint
router.delete('/delete/:id', middleware.validateSession, async(req, res)=>{
    try{
        const locatedPie = await PieModel.destroy({
            where: {id: req.params.id}
        })
        res.status(200).json({
            message: 'Pies successfully deleted',
            deletedPie: locatedPie
            })
    } catch(err) {
        res.status(500).json({
            message: `Failed to delete pie: ${err}`
        })
    }
})
module.exports = router;