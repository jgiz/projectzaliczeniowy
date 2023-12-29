import React, {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

 const NoteEditor = ({ note, onSave}) => {
    const [editedNote, setEditedNote] = useState(note || { title: '', content: '' });

    const handleTitleChange = (e) => {
        setEditedNote((prevNote) => ({ ...prevNote, title: e.target.value }));
    };

    const handleContentChange = (e) => {
        setEditedNote((prevNote) => ({ ...prevNote, content: e.target.value }));
    };

    const handleSave = () => {
        onSave(editedNote);
    };
    useEffect(() => {
        setEditedNote(note||{ title: '', content: '' })
    }, [note]);

    return (
        <div>
            <TextField
                label="Tytuł"
                variant="outlined"
                fullWidth
                value={editedNote.title}
                onChange={handleTitleChange}
                sx={{marginBottom:2}}
            />
            <TextField
                label="Treść"
                variant="outlined"
                fullWidth
                multiline
                rows={10}
                value={editedNote.content}
                onChange={handleContentChange}
            />
            <Box mt={2}>
                <Button sx={{margin:1}} variant="contained" color="primary" onClick={handleSave}>
                    Zapisz
                </Button>
            </Box>
        </div>
    );
};

export default NoteEditor;

