import React from 'react'
import './Home.css'
import Img1 from './HomeImg1.png'
import Img2 from './HomeImg2.png'
import Img3 from './HomeImg3.png'

export default function Home() {
  return (
    <div>
        <div className="section1">
            <p className="welcomeText">Welcome to SpeechFinder! We will help you to find what you are looking for. For example, if you need to find specific keywords from an speech or interview, head over to our Discover tab. If you would like to contribute to our database, go to the Contribute tab.</p>
            <img className='img1' src={Img1} alt="image 1"/>
        </div>
        <div className="section2">
            <img className='img2' src={Img2} alt="image 2"/>
            <div>
                <p className="discoverText">Journalists can search for quotes by free-text keywords or popular entities/categories. Once the search is input, excerpts(audio/transcribed files) that contain the specific keywords is presented. Click the button below to get started!</p>
                <a className='HomeButtonLink' href="/discover"><span className='HomeButtonName'>Discover Transcriptions and Audio</span></a>
            </div>
        </div>
        <div className="section3">
            <div>
                <p className="contributeText">You can also contribute to our database, either audios or articles. Fill out the required fields and upload/record an audio. Click the button to get started!</p>
                <a className='HomeButtonLink' href="/contribute"><span className='HomeButtonName'>Contribute Transcriptions and Audio</span></a>
            </div>
            <img className='img3' src={Img3} alt="image 3"/>
        </div>
    </div>
  )
}
