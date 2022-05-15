import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
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
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/discover" element={<Discover/>}/>
            <Route path="/contribute" element={<Contribute/>}/>
            <Route path='/result/:id' element={<Result/>}/>
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
