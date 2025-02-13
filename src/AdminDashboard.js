import React, { useState, useEffect } from "react";
import { db } from "./backend/firebase-config";
import { collection, addDoc,deleteDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [sessionName, setSessionName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    const fetchSessions = async () => {
      const sessionsCollection = collection(db, "voting_sessions");
      const sessionSnapshot = await getDocs(sessionsCollection);
      setSessions(sessionSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchSessions();
  }, []);

  const handleCreateSession = async () => {
    if (!sessionName || !startTime || !endTime) {
      alert("All fields are required!");
      return;
    }

    try {
      await addDoc(collection(db, "voting_sessions"), {
        sessionName,
        startTime,
        endTime,
        status: "active",
      });

      alert("Session created successfully!");
      setSessionName("");
      setStartTime("");
      setEndTime("");
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const handleEndSession = async (sessionId) => {
    try {
      await updateDoc(doc(db, "voting_sessions", sessionId), { status: "ended" });
      //getting all vote from database
      const votesCollection = collection(db, "votes");
      const votesSnapshot = await getDocs(votesCollection)

      //deleting each vote
      votesSnapshot.forEach(async (voteDoc) => {
        await deleteDoc(doc(db, "votes", voteDoc.id));
      });
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };
  const goToHome = () => {
    window.location.href = "/"; // Redirect to the home page
  };



  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="session-form">
        <h3>Create a Voting Session</h3>
        <input type="text" placeholder="Session Name" value={sessionName} onChange={(e) => setSessionName(e.target.value)} />
        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        <button onClick={handleCreateSession}>Create Session</button>
      </div>

      <div className="sessions-list">
        <h3>Active Sessions</h3>
        {sessions.map((session) =>
          session.status === "active" ? (
            <div key={session.id} className="session-card">
              <h4>{session.sessionName}</h4>
              <p>Start: {session.startTime}</p>
              <p>End: {session.endTime}</p>
              <button onClick={() => handleEndSession(session.id)}>End Session</button>
            </div>
          ) : null
        )}
      </div>

      <div className="sessions-list">
        <h3>Past Sessions</h3>
        {sessions.map((session) =>
          session.status === "ended" ? (
            <div key={session.id} className="session-card ended">
              <h4>{session.sessionName}</h4>
              <p>Start: {session.startTime}</p>
              <p>End: {session.endTime}</p>
              <p>Status: Ended</p>
            </div>
          ) : null
        )}
      </div>
      <button onClick={goToHome} className="home-button">got to home</button>
    </div>
  );
};

export default AdminDashboard;
