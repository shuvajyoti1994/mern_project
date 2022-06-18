import NoteCotext from "./noteContext";
import { useState } from "react";


const NoteState = (props) => {
  const host = "http://localhost:5000"
  const notesInitial = []

  const [notes, setNotes] = useState(notesInitial)


  //Get all Note 
  const getNotes = async () => {
    const respons = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "auth-token":localStorage.getItem('token')
      },
    });
    const json = await respons.json()
    console.log(json);
    setNotes(json)
  }

  //Add a Note 
  const addNote = async (title, description, tag) => {
    const respons = await fetch(`${host}/api/notes/addnote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "auth-token":localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });
    const note = await respons.json()
    setNotes(notes.concat(note))
  }

  //Delete a Note
  const deleteNote = async (id) => {
    //API Call
    const respons = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "auth-token":localStorage.getItem('token')
      }
    })
    const json =await  respons.json()
    console.log(json);

    //client side method
    const newNote = notes.filter((note) => { return note._id !== id })
    setNotes(newNote)
    // console.log('delete the note id ' + id);
  }

  //Edit a Note
  const editNote = async (id, title, description, tag) => {
    //API Call
    const respons = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "auth-token":localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    })
    const json = await respons.json()
    console.log(json);

    let newNotes = JSON.parse(JSON.stringify(notes))
    //Logic to edit in clent
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes)
  }

  return (
    <NoteCotext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteCotext.Provider>
  )
}

export default NoteState;