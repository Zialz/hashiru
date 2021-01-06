import './App.css';
import {Map} from './Components/Run.js'
import Nav from './Components/Nav.js'
import Graph from './Components/Graph.js'
import Holder from './Components/Holder.js'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <div className="App">
      <Nav/>        
        <Switch>
          <Route path="/holder" component={Holder} />
          <Route path="/graph" component={Graph}/>
          <Route path="/run" component={Map}/>

        </Switch>
      </div>
    </Router>

  );
}

export default App;
