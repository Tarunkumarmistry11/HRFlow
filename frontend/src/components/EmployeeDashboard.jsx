import{ useEffect, useState } from 'react';
import axios from 'axios';

function EmployeeDashboard() {
  const [resignation, setResignation] = useState(null);
  const [lwd, setLwd] = useState('');
  const [responses, setResponses] = useState([{ questionText: 'Why are you leaving?', response: '' }]);

  useEffect(() => {
    const fetchResignation = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user/resignations', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setResignation(response.data.data[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchResignation();
  }, []);

  const submitResignation = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/user/resign', { lwd }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setResignation({ _id: response.data.data.resignation._id, status: 'pending', intendedLwd: lwd });
    } catch (error) {
      alert('Submission failed: ' + (error.response?.data.message || 'Server error'));
    }
  };

  const submitExitInterview = async () => {
    try {
      await axios.post('http://localhost:8080/api/user/responses', { responses }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Exit interview submitted');
    } catch (error) {
      alert('Submission failed: ' + (error.response?.data.message || 'Server error'));
    }
  };

  return (
    <div className="container mt-5">
      <h2>Employee Dashboard</h2>
      {!resignation ? (
        <div>
          <input className="form-control mb-2" type="date" value={lwd} onChange={e => setLwd(e.target.value)} />
          <button className="btn btn-primary" onClick={submitResignation}>Submit Resignation</button>
        </div>
      ) : resignation.status === 'pending' ? (
        <p>Resignation pending. Intended last working day: {resignation.intendedLwd}</p>
      ) : resignation.status === 'approved' && !resignation.exitInterviewSubmitted ? (
        <div>
          <p>Resignation approved. Exit date: {resignation.exitDate}</p>
          {responses.map((resp, idx) => (
            <div key={idx} className="mb-2">
              <label>{resp.questionText}</label>
              <input className="form-control" value={resp.response} onChange={e => {
                const newResponses = [...responses];
                newResponses[idx].response = e.target.value;
                setResponses(newResponses);
              }} />
            </div>
          ))}
          <button className="btn btn-primary" onClick={submitExitInterview}>Submit Exit Interview</button>
        </div>
      ) : (
        <p>Exit interview submitted.</p>
      )}
    </div>
  );
}

export default EmployeeDashboard;