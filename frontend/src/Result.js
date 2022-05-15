import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import './Result.css'

export default function Result() {

    const [title, setTitle] = useState('')
    const [speaker, setSpeaker] = useState('')
    const [location, setLocation] = useState('')
    const [description, setDescription] = useState('')
    const [text, setText] = useState('')
    const [highlights, setHighlights] = useState([])
    const {id} = useParams()

    useEffect(() => {
        fetch("http://localhost:5000/getOne/" + id)
        .then(response => response.json())
        .then((data) => {
            let file = data['file']
            setTitle(file.title)
            setSpeaker(file.speaker)
            setLocation(file.location)
            setDescription(file.description)
            setText(file.text)
            setHighlights(file.highlights)
        })
    }, [])

  return (
    <div className='resultcomponent'>
        <div className="resultSection">
        <span className='subheader1'>Title: </span>
        <span className='text1'>{title}</span>
        </div>
        <div className="resultSection">
        <span className='subheader2'>Speaker: </span>
        <span className='text2'>{speaker}</span>
        </div>
        <div className="resultSection">
        <span className='subheader3'>Location: </span>
        <span className='text3'>{location}</span>
        </div>
        <div className="resultSection">
        <span className='subheader4'>Description: </span>
        <span className='text4'>{description}</span>
        </div>
        <div className="resultSection">
        <span className='subheader5'>Text: </span>
        <span className='text5'>{text}</span>
        </div>
        <div className="resultSection">
        <p className='subheader6'>Important Words/Phrases: </p>
        <div className="highlightedTerms">
        {(highlights).map ((highlight, index) => (
            <div className='highlightDiv'>
                <span className='text6'>{highlight.text}</span>
            </div>
        ))}
        </div>
        </div>
    </div>
  )
}
