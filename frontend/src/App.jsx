import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css'
import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import HRDashboard from './components/HRDashboard';

function App() {
 
<div>Hello</div>
  return (
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/employee" component={EmployeeDashboard} />
          <Route path="/hr" component={HRDashboard} />
        </Switch>
      </Router>
  )
}

export default App
