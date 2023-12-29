import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

const NoteList = ({ notes, onNoteClick }) => {
    return (
        <List component="nav">
            {notes.map((note) => (
                <div key={note.id}>
                    <ListItem button onClick={() => onNoteClick(note._id)}>
                        <ListItemText primary={note.title} secondary={note.date} />
                    </ListItem>
                    <Divider />
                </div>
            ))}
        </List>
    );
};

export default NoteList;
