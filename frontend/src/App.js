import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import Home from './Home'
import Discover from './Discover'
import Contribute from './Contribute'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className='content'>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/discover" component={Discover}/>
            <Route exact path="/contribute" component={Contribute}/>
          </Switch>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
