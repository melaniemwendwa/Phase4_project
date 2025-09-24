import React, { useEffect, useState } from "react";
import { fetchEvents, createEvent, updateEvent, deleteEvent } from "../apiEvents";
import { useParams } from "react-router-dom";
import Modal from "./Modal";
import { FaPlus, FaCalendarAlt } from 'react-icons/fa';

export default function GroupCalendar() {
  const { id: groupId } = useParams();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", start_time: "", end_time: "" });
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEvents(groupId).then(setEvents);
  }, [groupId]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await updateEvent(groupId, editing.id, form);
    } else {
      await createEvent(groupId, form);
    }
    fetchEvents(groupId).then(setEvents);
    setForm({ title: "", description: "", start_time: "", end_time: "" });
    setEditing(null);
    setShowModal(false);
  };

  const handleEdit = event => {
    setEditing(event);
    setForm({
      title: event.title,
      description: event.description,
      start_time: event.start_time.slice(0, 16),
      end_time: event.end_time ? event.end_time.slice(0, 16) : ""
    });
    setShowModal(true);
  };

  const handleDelete = async eventId => {
    await deleteEvent(groupId, eventId);
    fetchEvents(groupId).then(setEvents);
  };

  const handleCreateClick = () => {
    setEditing(null);
    setForm({ title: "", description: "", start_time: "", end_time: "" });
    setShowModal(true);
  };

  return (
    <div className="calendar-view">
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.2em'}}>
        <div style={{display:'flex', alignItems:'center', gap:'0.7rem'}}>
          <FaCalendarAlt style={{color: 'var(--primary)'}} />
          <h2 style={{fontFamily:'Poppins', fontWeight:700, fontSize:'1.2em', color:'var(--primary)', margin:0}}>Group Session Calendar</h2>
        </div>
        <button className="button calendar-add" onClick={handleCreateClick} title="Add event">
          <FaPlus style={{marginRight:'0.5rem'}} />
          Add Event
        </button>
      </div>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)}>
        <div style={{fontFamily:'Poppins', padding:'1em 0'}}>
          <h2 style={{marginBottom:'1em', fontWeight:700, fontFamily:'Poppins', fontSize:'1.2em', color:'var(--primary)'}}>{editing ? "Edit Event" : "Create Event"}</h2>
          <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'0.9rem', fontFamily:'Poppins'}}>
            <input className="form-control" type="text" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            <textarea className="form-control form-textarea" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <input className="form-control" type="datetime-local" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} required />
            <input className="form-control" type="datetime-local" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} />
            <div style={{display:'flex', justifyContent:'flex-end', gap:'0.6rem'}}>
              <button type="button" className="btn btn-ghost btn-small" onClick={() => { setShowModal(false); setEditing(null); }}>Cancel</button>
              <button className="btn btn-primary" type="submit">{editing ? "Update" : "Create"} Event</button>
            </div>
          </form>
        </div>
      </Modal>
      <ul className="calendar-list" style={{listStyle:'none', padding:0, marginTop:'2em'}}>
        {events.length === 0 ? (
          <li style={{fontFamily:'Poppins', color:'var(--text)', opacity:0.7, textAlign:'center', padding:'2em 0'}}>No events scheduled yet.</li>
        ) : (
          events.map(ev => (
            <li key={ev.id} style={{background:'var(--card-bg)', borderRadius:'16px', boxShadow:'0 2px 8px rgba(123,155,140,0.10)', padding:'1.2em', marginBottom:'1.2em'}}>
              <strong style={{fontSize:'1.1em', color:'var(--primary)'}}>{ev.title}</strong> <br />
              <span style={{color:'var(--text)', fontSize:'1em'}}>{ev.description}</span><br />
              <span style={{color:'#718096', fontSize:'0.98em'}}>{new Date(ev.start_time).toLocaleString()} - {ev.end_time ? new Date(ev.end_time).toLocaleString() : ""}</span><br />
              <div style={{marginTop:'0.7em', display:'flex', gap:'1em'}}>
                <button className="button" style={{borderRadius:'999px', fontFamily:'Poppins', fontWeight:600, fontSize:'0.95em', background:'var(--lavender)', color:'var(--background)', padding:'0.4em 1em'}} onClick={() => handleEdit(ev)}>Edit</button>
                <button className="button" style={{borderRadius:'999px', fontFamily:'Poppins', fontWeight:600, fontSize:'0.95em', background:'#EF4444', color:'var(--background)', padding:'0.4em 1em'}} onClick={() => handleDelete(ev.id)}>Delete</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
