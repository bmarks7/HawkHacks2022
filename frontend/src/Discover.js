import React, {useState} from 'react'
import './Discover.css'
import magnifyingGlass from './magnifyingGlass.png'

export default function Discover() {

    const [searchVal, setSearchVal] = useState('')
    const [location, setLocation] = useState('')
    const [results, setResults] = useState([])

    const searchClicked = () => {
        if(searchVal !== ""){
            let locationValue = location
            if(location === ""){
                locationValue = 'nowhere'
            }
            fetch("http://localhost:5000/" + searchVal + '/' + locationValue)
                .then(response => response.json())
                .then((data) => {
                    setResults(data['results'])
                })
        }
    }

  return (
    <div className="discover">
        <p className="searchText">Search the keywords you're looking for</p>
        <div className='searchArea'>
            <input className="searchField" type="text" value={searchVal} onChange={(e) => setSearchVal(e.target.value)}/>
            <img className='searchIcon' src={magnifyingGlass} alt="search icon" onClick={searchClicked}/>
        </div>

        <p className="locationText">Filter by location &#40;Optional&#41;</p>
        <input className="locationField" type="text" value={location} onChange={(e) => setLocation(e.target.value)}/>
        {/* Citation: "https://icons8.com/icon/YFKL7HQnyLSb/magnifying-glass" */}
        <p className='resultsHeader'>Results</p>
        <div className="resultsList">
            {results.map((result, index) => (
                <div className='result'>
                    <p className='resultSubheader'>Keywords</p>
                    <div className="result_highlights">
                        {(result.highlights).map((highlight, index) => (
                            <div key={index}>
                                <p className="result_highlight">{highlight.text}</p>
                            </div>
                        ))}
                    </div>
            
                    <p className='resultSubheader'>Excerpt</p>
                    <div className="result_excerpt">
                        <p className="result_excerpt_text">{result.text.split('.').length < 2 ? (result.text) : (result.text.split('.')[0].concat('. ', result.text.split('.')[1]))}</p>
                    </div>

                    <a href={`result/${result.id}`}>More</a>
                </div>
            
            ))}
        </div>

    </div>
  )
}
