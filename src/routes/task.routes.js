const express = require("express")
const router = express.Router()
const taskmodel = require("../models/task.models")

router.get("/", async (req, res) => {

    const tasks = await taskmodel.find()
    res.json(tasks)

})

router.get("/:id", async (req, res) => {

    res.json(await taskmodel.findById(req.params.id))

})

router.post("/", async (req, res) => {

    const { title, description } = req.body
    const task = new taskmodel({title, description})
    await task.save()
    res.json("Task saved")

})

router.put("/:id", async (req, res) => {

    const {title, description} = req.body
    await taskmodel.findByIdAndUpdate(req.params.id, {title, description})
    res.json("Task updated")

})

router.delete("/:id", async (req, res) => {

    await taskmodel.findByIdAndDelete(req.params.id)
    res.json("Task deleted")

})

module.exports = router