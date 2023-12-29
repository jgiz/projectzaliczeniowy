import React, {useEffect, useState} from 'react'
import {Box,TextField,Fab} from '@mui/material';
import {Add as AddIcon} from '@mui/icons-material'
import NoteList from '../NoteList/NoteList';
import NoteEditor from '../NoteEditor/NoteEditor.jsx';

export const Dashboard = (props) => {
    const [selectedNote, setSelectedNote] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [notes, setNotes] = useState([
    ]);

    const handleNoteClick = (noteId) => {
        const selected = notes.find((note) => note._id === noteId);
        setSelectedNote(selected);
    };
    const fetchNotes = () =>{
        fetch('http://localhost:3000/note/list',{
            method:"GET",
            headers: {
                "Content-Type": "application/json",
                "x-code":localStorage.getItem("code")
            }
        }).then(async(res)=>{
            if(res.status >= 200 && res.status < 300) {
                const json = await res.json()
                setNotes(json.data)
                console.log(json.data)
            }
        })
    }
    useEffect(()=>{
        fetchNotes()
    },[props.logined])
    const handleNewNoteClick = () => {
        const newNote = {
            title: 'Nowa notatka',
            date: new Date().toLocaleDateString(),
            content: 'notatka...',
        };
        fetch('http://localhost:3000/note/create',{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                "x-code":localStorage.getItem("code")
            },
            body:JSON.stringify(newNote)
        }).then(async(res)=>{
            const json = await res.json()
            if(res.status >= 200 && res.status < 300) {
                fetchNotes()
                setSelectedNote(json.data);
            }
            else{
                alert(json.error)
            }
        })

    };

    const handleSaveNote = (editedNote) => {
        fetch('http://localhost:3000/note/modify',{
            method:"PATCH",
            headers: {
                "Content-Type": "application/json",
                "x-code":localStorage.getItem("code")
            },
            body: JSON.stringify(editedNote)
        }).then(async(res)=>{
            const json = await res.json()
            if(res.status >= 200 && res.status < 300) {
                setSelectedNote(null);
                fetchNotes()
            }
            else{
                alert(json.error)
            }
        })

    };


    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredNotes = notes.filter((note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {props.logined.state && <>
                <Box display="flex">
                    <Box width="30%" p={2}>
                        <TextField
                            label="Wyszukaj notatkę"
                            variant="outlined"
                            fullWidth
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <NoteList notes={filteredNotes} onNoteClick={handleNoteClick} />
                    </Box>
                    <Box width="70%" p={2}>
                        {selectedNote ? (
                            <NoteEditor note={selectedNote} onSave={handleSaveNote}
                            />
                        ) : (
                            <div>
                                <h2>Wybierz notatkę</h2>
                            </div>
                        )}
                    </Box>
                    <Fab color="secondary" aria-label="add" onClick={handleNewNoteClick} sx={{position:'absolute',bottom:40,right:40,zIndex:10}}>
                        <AddIcon />
                    </Fab>
                </Box>
            </>}
            {
                !props.logined.state&&<>
                    <h2><a href="/login">Zaloguj się</a></h2>
                </>
            }
        </>
    );
};

