const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/fetchuser')
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');


//ROUTE:1 Get All the notes using GET "/api/notes/fetchallnotes" Login require
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
    const note = await Note.find({ user: req.user.id })
    res.json(note)
} catch (error) {
        res.status(500).send("Internal server error")
}
})

//ROUTE:2 Add a new note using POST "/api/notes/addnote" Login require
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be 5 charecters').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body
        //if there are error send bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const saveNote = await note.save()
        res.json(saveNote)
    } catch (error) {
        res.status(500).send("Internal server error")
    }
})

//ROUTE:3 Update an existing note using PUT "/api/notes/updatenote" Login require
router.put('/updatenote/:id', async (req, res) => {
    try { 
    const {title,description,tag} = req.body;
    //Create a newNote object
    const newNote = {}
    if(title){newNote.title = title}
    if(description){newNote.description = description}
    if(tag){newNote.tag = tag}

    //Find the note to update and update it
    let note = await Note.findById(req.params.id)
    if(!note){
       return res.status(404).send("Not Found")
    }

    // if(note.user.toString() !== req.user.id) {
    //    return res.status(401).send("Not Allowed")
    // }

    note= await Note.findByIdAndUpdate(req.params.id, {$set: newNote},{new:true})
    res.json({note})
} catch (error) {
    console.log(error);
    res.status(500).send("Internal server error")
 
}

})

//ROUTE:4 Delete an existing note using DELETE "/api/notes/deletenote" Login require
router.delete('/deletenote/:id',fetchuser, async (req, res) => {
    try {     
        //Find the note to update and update it
        let note = await Note.findById(req.params.id)
        if(!note){
           return res.status(404).send("Not Found")
        }
    
        // if(note.user.toString() !== req.user.id) {
        //    return res.status(401).send("Not Allowed")
        // }
    
        note= await Note.findByIdAndDelete(req.params.id)
        res.json({"Success":"note has been deleted",note:note})
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
     
    }
})


module.exports = router;