import './Navbar.css'

export default function Navbar() {
  return (
    <div className='navbar'>
        <h1 className='title'>SpeechFinder</h1>
        <div className="links">
            <a className='link' href="/"><p className='linkName'>Home</p></a>
            <a className='link' href="/discover"><p className='linkName'>Discover</p></a>
            <a className='link' href="/contribute"><p className='linkName'>Contribute</p></a>
        </div>
    </div>
  )
}
