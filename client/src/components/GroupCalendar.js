import React, { useEffect, useState, useContext } from "react";
import { fetchEvents, createEvent, updateEvent, deleteEvent } from "../apiEvents";
import { useParams } from "react-router-dom";
import Modal from "./Modal";
import { FaPlus, FaCalendarAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthProvider';

export default function GroupCalendar() {
  const { id: groupId } = useParams();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", start_time: "", end_time: "" });
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tick, setTick] = useState(0); // used to refresh time-left labels every minute
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchEvents(groupId).then(setEvents).catch(() => setEvents([]));
  }, [groupId]);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const reload = () => fetchEvents(groupId).then(setEvents).catch(() => setEvents([]));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editing) {
        await updateEvent(groupId, editing.id, form);
      } else {
        await createEvent(groupId, form);
      }
      reload();
      setForm({ title: "", description: "", start_time: "", end_time: "" });
      setEditing(null);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = event => {
    setEditing(event);
    setForm({
      title: event.title || "",
      description: event.description || "",
      start_time: event.start_time ? event.start_time.slice(0, 16) : "",
      end_time: event.end_time ? event.end_time.slice(0, 16) : ""
    });
    setShowModal(true);
  };

  const handleDelete = async eventId => {
    try {
      await deleteEvent(groupId, eventId);
      reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateClick = () => {
    setEditing(null);
    setForm({ title: "", description: "", start_time: "", end_time: "" });
    setShowModal(true);
  };

  function timeLeftLabel(endTime, startTime) {
    const t = endTime || startTime;
    if (!t) return '';
    const end = new Date(t).getTime();
    const now = Date.now();
    const diff = end - now;
    if (diff <= 0) return 'Ended';
    const minutes = Math.floor(diff / 60000);
    const days = Math.floor(minutes / (60 * 24));
    const hours = Math.floor((minutes % (60 * 24)) / 60);
    const mins = minutes % 60;
    if (days > 0) return `Ends in ${days}d ${hours}h`;
    if (hours > 0) return `Ends in ${hours}h ${mins}m`;
    return `Ends in ${mins}m`;
  }

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
          <form onSubmit={handleSubmit} className="ms-form" aria-label="Event form">
            <div className="ms-row">
              <label className="ms-label" htmlFor="event-title">Title</label>
              <input id="event-title" className="form-control ms-input" type="text" placeholder="Event title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>

            <div className="ms-row">
              <label className="ms-label" htmlFor="event-desc">Description</label>
              <textarea id="event-desc" className="form-control ms-textarea" placeholder="Short description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="ms-row ms-grid-2">
              <div>
                <label className="ms-label" htmlFor="event-start">Starts</label>
                <input id="event-start" className="form-control ms-input" type="datetime-local" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} required />
              </div>
              <div>
                <label className="ms-label" htmlFor="event-end">Ends</label>
                <input id="event-end" className="form-control ms-input" type="datetime-local" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} />
              </div>
            </div>

            <div className="ms-actions">
              <button type="button" className="btn btn-ghost btn-small" onClick={() => { setShowModal(false); setEditing(null); }}>Cancel</button>
              <button className="btn btn-primary ms-primary" type="submit">{editing ? "Update" : "Create"} Event</button>
            </div>
          </form>
        </div>
      </Modal>

      <ul className="calendar-list" style={{listStyle:'none', padding:0, marginTop:'1rem'}}>
        {events.length === 0 ? (
          <li style={{fontFamily:'Poppins', color:'var(--text)', opacity:0.7, textAlign:'center', padding:'2em 0'}}>No events scheduled yet.</li>
        ) : (
          events.map(ev => {
            const canEdit = user && (ev.user_id === user.id || ev.creator_id === user.id || ev.user?.id === user.id);
            return (
              <li key={ev.id} className="calendar-item compact">
                <div className="event-main">
                  <div className="event-title">{ev.title}</div>
                  <div className="time-left" aria-label={`Time left until event ends`}>{timeLeftLabel(ev.end_time, ev.start_time)}</div>
                </div>
                {canEdit && (
                  <div className="event-actions">
                    <button className="btn-ghost" onClick={() => handleEdit(ev)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(ev.id)}>Delete</button>
                  </div>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
