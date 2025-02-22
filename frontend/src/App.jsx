import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import HRDashboard from './components/HRDashboard';
import './App.css';


function App() {

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/employee" component={EmployeeDashboard} />
        <Route path="/hr" component={HRDashboard} />
      </Switch>
    </Router>
  );
}

export default App;
