import React, {useContext} from 'react'
import { FaTrashAlt } from "react-icons/fa";
import { AiTwotoneEdit } from "react-icons/ai";
import noteCotext from '../contex/notes/noteContext';

const Noteitem = (props) => {
    const context = useContext(noteCotext);
    const { deleteNote } = context;
    const { note , updateNote} = props;
    return (
        <div className='col-md-3'>
            <div className ="card my-3 mx-2">
                <div className="card-body">
                    <div className='d-flex align-item-center'>
                    <h5 className="card-title">{note.title}</h5>
                    <AiTwotoneEdit className='mx-3 cardIcon' onClick={()=>{updateNote(note)}}/>
                    <FaTrashAlt className='mx-3 cardIcon' onClick={()=>{deleteNote(note._id);props.showAlert("Note has been Deleted","danger")}} />
                    </div>
                    <p className="card-text">{note.description}</p>
                 
                </div>
            </div>
        </div>
    )
}

export default Noteitem;