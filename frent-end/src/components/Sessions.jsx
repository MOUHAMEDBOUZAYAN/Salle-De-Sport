import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../services/authService';

const API_URL = import.meta.env.VITE_API_URL;

const Sessions = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      const res = await axios.get(`${API_URL}/sessions`, {
        headers: { Authorization: getToken() }
      });
      setSessions(res.data);
    };
    fetchSessions();
  }, []);

  const handleReserve = async (sessionId) => {
    await axios.post(`${API_URL}/sessions/${sessionId}/reserve`, {}, {
      headers: { Authorization: getToken() }
    });
    alert('Réservation confirmée !');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Sessions Disponibles</h1>
      {sessions.map(session => (
        <div key={session._id} className="p-4 border rounded my-2">
          <h2 className="text-lg font-semibold">{session.title}</h2>
          <p>{session.description}</p>
          <button onClick={() => handleReserve(session._id)}
                  className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
            Réserver
          </button>
        </div>
      ))}
    </div>
  );
};

export default Sessions;
