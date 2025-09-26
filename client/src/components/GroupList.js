import { useEffect, useState } from "react";
import { fetchGroups } from '../api';
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function GroupList() {
  const [groups, setGroups] = useState([]);
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [meetingTimes, setMeetingTimes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchGroups()
      .then((data) => setGroups(data))
      .catch(() => setError("Failed to load groups."))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingGroup) {
        // Update group in static array
        const updated = { ...editingGroup, topic, description, meeting_times: meetingTimes };
        setGroups(groups.map((g) => (g.id === updated.id ? updated : g)));
        setEditingGroup(null);
      } else {
        // Create group in static array
        const newGroup = {
          id: Date.now(),
          topic,
          description,
          meeting_times: meetingTimes,
        };
        setGroups([...groups, newGroup]);
      }
      setTopic("");
      setDescription("");
      setMeetingTimes("");
    } catch {
      setError(`Failed to ${editingGroup ? "update" : "create"} group.`);
    }
  };
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      setGroups(groups.filter((g) => g.id !== id));
    }
  };

  const handleEditClick = (group) => {
    setEditingGroup(group);
    setTopic(group.topic);
    setDescription(group.description);
    setMeetingTimes(group.meeting_times);
  };

  return (
    <div className="support-groups" style={{background: 'var(--bg)'}}>
      <h2>{editingGroup ? "Edit Group" : "Create a New Group"}</h2>
      {error && <div className="alert">{error}</div>}
      <Formik
        enableReinitialize
        initialValues={{ topic: topic, description: description, meeting_times: meetingTimes }}
        validationSchema={Yup.object().shape({ topic: Yup.string().required('Topic is required').min(3,'Too short'), description: Yup.string().required('Description required').min(10,'Too short'), meeting_times: Yup.string().max(255) })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          try {
            if (editingGroup) {
              const updated = { ...editingGroup, topic: values.topic, description: values.description, meeting_times: values.meeting_times };
              setGroups(groups.map((g) => (g.id === updated.id ? updated : g)));
              setEditingGroup(null);
            } else {
              const newGroup = {
                id: Date.now(),
                topic: values.topic,
                description: values.description,
                meeting_times: values.meeting_times,
              };
              setGroups([...groups, newGroup]);
            }
            setTopic(''); setDescription(''); setMeetingTimes('');
            resetForm();
          } catch (err) {
            setError(`Failed to ${editingGroup ? "update" : "create"} group.`);
          } finally { setSubmitting(false) }
        }}
      >{({ isSubmitting }) => (
        <Form className="group-form">
          <Field name="topic" placeholder="Topic" className="form-control" />
          <div style={{color:'#b91c1c', fontSize:'0.85rem'}}><ErrorMessage name="topic" /></div>
          <Field as="textarea" name="description" placeholder="Description" className="form-control" />
          <div style={{color:'#b91c1c', fontSize:'0.85rem'}}><ErrorMessage name="description" /></div>
          <Field name="meeting_times" placeholder="Meeting Times" className="form-control" />
          <div style={{color:'#b91c1c', fontSize:'0.85rem'}}><ErrorMessage name="meeting_times" /></div>
          <button type="submit" disabled={isSubmitting}>{editingGroup ? "Update Group" : "Create Group"}</button>
        </Form>
      )}</Formik>
      <hr/>

      <h2>Available Support Groups</h2>
      {loading ? <p className="muted">Loading...</p> : null}
      <ul className="groups-list">
        {groups.map((g) => (
          <li key={g.id} className="group-item">
            <h3 className="group-topic">
              <Link to={`/groups/${g.id}`}>{g.topic}</Link>
            </h3>
            <p className="group-description">{g.description}</p>
            <p className="group-meeting-times">{g.meeting_times}</p>
            <p className="group-members" style={{color:'#6B7280'}}>{g.member_count ?? 0} members</p>
            <div className="group-actions">
              <button onClick={() => handleEditClick(g)}>Edit</button>
                            <button onClick={() => handleDelete(g.id)}>Delete</button>
              <Link to={`/groups/${g.id}`}>View</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}