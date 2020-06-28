const router = require('express').Router();
const Hashtag = require('../models/hashtag');

router.get('/get-mandatory', async (req, res) => {
    try {
        const mandatory = await Hashtag.find({ mandatory: true })
        if (!mandatory) {
            return res.status(200).json({
                message: "No Mandatory fields are present in DB",
                success: false
            })
        } else {

            let mandatoryTags = [];
            for (tag of mandatory) {
                mandatoryTags.push(tag.group)
            }
            const relatedTags = await Hashtag.find({ 'group': mandatoryTags });
            if (relatedTags) {
                mandatory.forEach(t => {
                    indx = relatedTags.findIndex((v) => {
                        return v.tag === t.tag
                    })
                    relatedTags.splice(indx, 1);
                })
                return res.status(200).json({
                    message: "Related tags retrieved successfully!!",
                    success: true,
                    relatedTags,
                    mandatory
                })
            } else {
                return res.status(200).json({
                    message: "Related tags retrieved successfully!!",
                    success: true,
                    relatedTags: null,
                    mandatory
                })
            }
        }

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Not able to save your HW",
            success: false
        })
    }
})

router.post('/get-related', async (req, res) => {
    try {
        if(!req.body.new){
            const relatedTags = await Hashtag.find({ 'group': req.body.group });
            if (relatedTags) {
                return res.status(200).json({
                    message: "Related tags retrieved successfully!!",
                    success: true,
                    relatedTags,
                })
            } else {
                return res.status(200).json({
                    message: "No related tags!!",
                    success: true,
                    relatedTags: null,
                })
            }
        }else{
            const tag = await Hashtag.findOne({ 'tag': req.body.value });
            if (tag) {
                const relatedTags = await Hashtag.find({ "group" : tag.group });
                relatedTags.splice(relatedTags.findIndex(v=>v.tag === req.body.value),1)

                return res.status(200).json({
                    message: "Related tags retrieved successfully!!",
                    success: true,
                    relatedTags,
                    newData:tag
                })
            } else {
                return res.status(200).json({
                    message: "No related tags!!",
                    success: true,
                    relatedTags: null,
                })
            }
        }
        

    } catch (err) { 
        return res.status(500).json({
            message: "Something went wrong!!",
            success: false
        })
    }
})


module.exports = router;