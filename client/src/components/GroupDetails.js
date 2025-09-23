import React, { useState, useEffect } from "react";
import { joinGroup, leaveGroup, getGroupMembers } from "../api";

function GroupDetails({ group, userId }) {
  const [isMember, setIsMember] = useState(false);
  const [role, setRole] = useState("member");
  const [members, setMembers] = useState([]);

  useEffect(() => {
    // fetch members of this group
    async function fetchMembers() {
      const data = await getGroupMembers(group.id);
      setMembers(data);

      const membership = data.find((m) => m.user.id === userId);
      if (membership) {
        setIsMember(true);
        setRole(membership.role);
      }
    }
    fetchMembers();
  }, [group.id, userId]);

  const handleJoin = async () => {
    const res = await joinGroup(userId, group.id, "member");
    if (!res.error) {
      setIsMember(true);
      setRole(res.role);
      setMembers([...members, res]);
    }
  };

  const handleLeave = async () => {
    const res = await leaveGroup(userId, group.id);
    if (res.message) {
      setIsMember(false);
      setRole("member");
      setMembers(members.filter((m) => m.user.id !== userId));
    }
  };

  return (
    <div>
      <h2>{group.topic}</h2>
      <p>{group.description}</p>

      {isMember ? (
        <>
          <p>You are a <b>{role}</b> in this group</p>
          <button onClick={handleLeave}>Leave Group</button>
        </>
      ) : (
        <button onClick={handleJoin}>Join Group</button>
      )}

      <h3>Members</h3>
      <ul>
        {members.map((m) => (
          <li key={m.id}>
            {m.user.nickname} ({m.role})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupDetails;
