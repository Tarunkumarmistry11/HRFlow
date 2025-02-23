import{ useEffect, useState } from 'react';
import axios from 'axios';

function HRDashboard() {
  const [resignations, setResignations] = useState([]);
  const [exitResponses, setExitResponses] = useState([]);
  const [exitDate, setExitDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resRes = await axios.get('http://localhost:8080/api/admin/resignations', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setResignations(resRes.data.data);
        const exitRes = await axios.get('http://localhost:8080/api/admin/exit_responses', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setExitResponses(exitRes.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const concludeResignation = async (id, approved) => {
    try {
      await axios.put('http://localhost:8080/api/admin/conclude_resignation', {
        resignationId: id, approved, lwd: approved ? exitDate : null
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setResignations(resignations.map(r => r._id === id ? { ...r, status: approved ? 'approved' : 'rejected', exitDate: approved ? exitDate : null } : r));
    } catch (error) {
      alert('Action failed: ' + (error.response?.data.message || 'Server error'));
    }
  };

  return (
    <div className="container mt-5">
      <h2>HR Dashboard</h2>
      <h3>Pending Resignations</h3>
      {resignations.filter(r => r.status === 'pending').map(r => (
        <div key={r._id} className="card mb-2">
          <div className="card-body">
            <p>Employee: {r.employeeId.username} | Intended LWD: {r.intendedLwd}</p>
            <input className="form-control d-inline-block w-25" type="date" onChange={e => setExitDate(e.target.value)} />
            <button className="btn btn-success mx-2" onClick={() => concludeResignation(r._id, true)}>Approve</button>
            <button className="btn btn-danger" onClick={() => concludeResignation(r._id, false)}>Reject</button>
          </div>
        </div>
      ))}
      <h3>Exit Interview Responses</h3>
      {exitResponses.map(er => (
        <div key={er._id} className="card mb-2">
          <div className="card-body">
            <p>Employee: {er.employeeId.username}</p>
            {er.responses.map((resp, idx) => (
              <p key={idx}>{resp.questionText}: {resp.response}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HRDashboard;