import logo from './logo.svg';
import './App.css';
import {Map} from './Components/Map/Run.js'
import Nav from './Components/Nav/Nav.js'
import Graph from './Components/Graph/Graph'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="App">
      <Nav/>        
        <Switch>
          <Route path="/graph" component={Graph}/>
          <Route path="/run" component={Map}/>
        </Switch>
      </div>
    </Router>

  );
}

export default App;
