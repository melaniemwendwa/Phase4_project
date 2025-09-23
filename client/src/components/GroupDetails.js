import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function GroupDetails() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    fetch(`/groups/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load group");
        return res.json();
      })
      .then(setGroup)
      .catch(() => setError("Failed to load group details"));
  }, [id]);

  const handleJoin = () => {
    setJoining(true);
    setError("");
    fetch(`/groups/${id}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: 1, role: "member" }), // placeholder current user
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to join");
        return res.json();
      })
      .then(() => {
        alert("Joined group!");
      })
            .catch(() => setError("Failed to join group"))
      .finally(() => setJoining(false));
  };

  if (!group) return <div>{error || "Loading..."}</div>;

  return (
    <div>
      <Link to="/groups">← Back to groups</Link>
      <h2>{group.topic}</h2>
      <p>{group.description}</p>
      <p><b>Meeting times:</b> {group.meeting_times}</p>
      <button onClick={handleJoin} disabled={joining}>
        {joining ? "Joining..." : "Join Group"}
      </button>
    </div>
  );
}