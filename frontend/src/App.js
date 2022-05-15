import './App.css';
import {BrowserRouter as Router, Route, Switch, useParams} from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import Home from './Home'
import Discover from './Discover'
import Contribute from './Contribute'
import Result from './Result'

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
            <Route exact path='/result/:id' component={Result}/>
          </Switch>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
