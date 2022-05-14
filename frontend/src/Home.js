import React from 'react'
import './Home.css'

export default function Home() {
  return (
    <div>
        <h2>What we are:</h2>
        <p>&#40;Description Here&#41;</p>

        <h2>Would you like to:</h2>
        <div className="HomeButtons">
            <a className='HomeButtonLink' href="/discover"><span className='HomeButtonName'>Discover Transcriptions and Audio</span></a>
            <a className='HomeButtonLink' href="/contribute"><span className='HomeButtonName'>Contribute Transcriptions and Audio</span></a>
        </div>
    </div>
  )
}
