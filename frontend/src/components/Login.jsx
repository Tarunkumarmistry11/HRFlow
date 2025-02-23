import{ useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      const tokenPayload = JSON.parse(atob(response.data.token.split('.')[1]));
      if (tokenPayload.role === 'HR') history.push('/hr');
      else history.push('/employee');
    } catch (error) {
      alert('Login failed: ' + (error.response?.data.message || 'Server error'));
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <input className="form-control mb-2" type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input className="form-control mb-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="btn btn-primary" onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;