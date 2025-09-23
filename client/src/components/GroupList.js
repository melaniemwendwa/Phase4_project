import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
    fetch("/groups")
      .then((res) => res.json())
      .then((data) => setGroups(data))
      .catch(() => setError("Failed to load groups."))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const method = editingGroup ? "PUT" : "POST";
    const url = editingGroup ? `/groups/${editingGroup.id}` : "/groups";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        description,
         meeting_times: meetingTimes,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to ${editingGroup ? "update" : "create"} group`);
        return res.json();
      })
      .then((data) => {
        if (editingGroup) {
          setGroups(groups.map((g) => (g.id === data.id ? data : g)));
          setEditingGroup(null);
        } else {
          setGroups([...groups, data]);
        }
        setTopic("");
        setDescription("");
        setMeetingTimes("");
      })
      .catch(() => setError(`Failed to ${editingGroup ? "update" : "create"} group.`));
  };
   const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      fetch(`/groups/${id}`, { method: "DELETE" })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to delete group");
          setGroups(groups.filter((g) => g.id !== id));
        })
        .catch(() => setError("Failed to delete group."));
    }
  };

  const handleEditClick = (group) => {
    setEditingGroup(group);
    setTopic(group.topic);
    setDescription(group.description);
    setMeetingTimes(group.meeting_times);
  };

  return (
    <div className="support-groups">
      <h2>{editingGroup ? "Edit Group" : "Create a New Group"}</h2>
      {error && <div className="alert">{error}</div>}
      <form onSubmit={handleSubmit} className="group-form">
        <input
          type="text"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Meeting Times"
          value={meetingTimes}
          onChange={(e) => setMeetingTimes(e.target.value)}
          required
        />
        <button type="submit">{editingGroup ? "Update Group" : "Create Group"}</button>
      </form>
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