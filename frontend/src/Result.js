import React from 'react'
import {useParams} from 'react-router-dom'

export default function Result() {
    const {id} = useParams()
  return (
    <div>
        <h2>{id}</h2>
    </div>
  )
}