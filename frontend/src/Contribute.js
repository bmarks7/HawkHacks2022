import React, {useState} from 'react'
import {Snackbar} from "@mui/material"
import './Contribute.css'

export default function Contribute() {
    const [title, setTitle] = useState('')
    const [speaker, setSpeaker] = useState('')
    const [location, setLocation] = useState('')
    const [description, setDescription] = useState('')
    const [tweet, setTweet] = useState(false)
    const [file, setFile] = useState(null)
    const [haveResponse, setHaveResponse] = useState(true)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    
    const handleSubmit = (e) => {
        e.preventDefault()
        e.target.reset()
        console.log('button pressed')
        const formData = new FormData()
        formData.append('title', title)
        formData.append('speaker', location)
        formData.append('location', location)
        formData.append('description', description)
        formData.append('tweet', tweet)
        formData.append('file', file)

        setTitle('')
        setSpeaker('')
        setLocation('')
        setDescription('')

        setHaveResponse(false)

        fetch('http://localhost:5000/', {
            method: 'POST',
            body: formData
        }).then((response) => {
            console.log('new speech added')
            setSnackbarOpen(true)
            setHaveResponse(true)
        })
    }

  return (
    <div className='contribute'>
        <p className='fillout'>Fill out the fields below and click submit!</p>
        <form onSubmit={handleSubmit}>
            <label className='titleLabel' htmlFor="">Title</label>
            <input className='titleInput' type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>

            <label className='speakerLabel' htmlFor="">Speaker</label>
            <input className='speakerInput' type="text" value={speaker} onChange={(e) => setSpeaker(e.target.value)}/>

            <label className='descriptionLabel' htmlFor="">Description &#40;What's in the audio&#41;</label>
            <textarea className='descriptionInput' value={description} onChange={(e) => setDescription(e.target.value)}/>

            <label className='locationLabel' htmlFor="">Location</label>
            <input className='locationInput' type="text" value={location} onChange={(e) => setLocation(e.target.value)}/>

            <div className='tweetSection'>
                <label className='tweetLabel' htmlFor="">Automatically Tweet Out Important Sentences</label>
                <input className='tweetBox' type="checkbox" onChange={(e) => setTweet(e.target.checked)} tweet/>
            </div>

            <label className='audioLabel' htmlFor="">Upload Audio File</label>
            <input className='audioInput' type="file" onChange = {(e) => {
                setFile(e.target.files[0])
                }}/>

            <input 
            className='submitButton' 
            type="submit" 
            value={haveResponse ? 'Submit' : 'Processing...'} 
            disabled={!haveResponse}/>
        </form>

        <Snackbar message='Entry submitted successfully!' 
        autoHideDuration={5000}
        open={snackbarOpen}
        />
    </div>
  )
}
