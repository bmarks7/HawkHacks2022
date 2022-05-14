import React, {useState} from 'react'
import './Contribute.css'

export default function Contribute() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [tweet, setTweet] = useState(false)
    const [file, setFile] = useState(null)
    
    const handleSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        formData.append('tweet', tweet)
        formData.append('file', file)

        fetch('http://localhost:5000/', {
            method: 'POST',
            body: formData
        }).then(() => {
            console.log('new speech added')
        })
    }

  return (
    <div className='contribute'>
        <p className='fillout'>Fill out the fields below and click submit!</p>
        <form onSubmit={handleSubmit}>
            <label className='titleLabel' htmlFor="">Title</label>
            <input className='titleInput' type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>

            <label className='descriptionLabel' htmlFor="">Description &#40;What's in the audio&#41;</label>
            <textarea className='descriptionInput' value={description} onChange={(e) => setDescription(e.target.value)}/>

            <div className='tweetSection'>
                <label className='tweetLabel' htmlFor="">Automatically Tweet Out Important Sentences</label>
                <input className='tweetBox' type="checkbox" value={tweet} onChange={(e) => setTweet(e.target.value)}/>
            </div>

            <div className='audioSection'>
                <label className='audioLabel' htmlFor="">Upload Audio File</label>
                <input className='audioInput' type="file" onChange = {(e) => {
                    setFile(e.target.files[0])
                    }}/>
            </div>

            <input className='submitButton' type="submit" value='Submit'/>
        </form>
    </div>
  )
}
