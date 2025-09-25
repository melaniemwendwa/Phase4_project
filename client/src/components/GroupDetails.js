import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchGroupDetails, joinGroup } from "../api";
import { AuthContext } from "../context/AuthProvider";

export default function GroupDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [group, setGroup] = useState(null);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    setError("");
    fetchGroupDetails(id)
      .then((data) => {
        setGroup(data);
      })
      .catch(() => setError("Failed to load group details"));
  }, [id]);

  const handleJoin = () => {
    if (!user) {
      setError("Please sign in to join groups.");
      return;
    }
    if (joined) return;
    setJoining(true);
    setError("");
    joinGroup(id, { user_id: user.id, role: "member" })
      .then((resp) => {
        setJoined(true);
        setGroup((g) => g ? { ...g, member_count: (g.member_count || 0) + (resp && resp.message === 'already a member' ? 0 : 1) } : g);
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
      <p><b>Members:</b> {group.member_count ?? 0}</p>
      <button onClick={handleJoin} disabled={joining || joined}>
        {joined ? "Joined" : (joining ? "Joining..." : "Join Group")}
      </button>
    </div>
  );
}