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
        <p className='subheader1'>Title: </p>
        <p className='text1'>{title}</p>
        <p className='subheader2'>Speaker: </p>
        <p className='text2'>{speaker}</p>
        <p className='subheader3'>Location: </p>
        <p className='text3'>{location}</p>
        <p className='subheader4'>Description: </p>
        <p className='text4'>{description}</p>
        <p className='subheader5'>Text: </p>
        <p className='text5'>{text}</p>
        <p className='subheader5'>Highlighted Terms: </p>
        <div className="highlightedTerms">
        {(highlights).map ((highlight, index) => (
            <div className='highlightDiv'>
                <p className='text6'>{highlight.text}</p>
            </div>
        ))}
        </div>
    </div>
  )
}
