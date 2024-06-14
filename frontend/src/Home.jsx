import React, {  useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const [name,setName]  = useState('');

    const [email,setEmail] = useState('');
    const [room,setRoom] = useState('')
    const navigate = useNavigate();
    const submitForm = ()=>{
        navigate(`/room/${room}`)
    }
  return (
    <div className='flex flex-col gap-2 w-60'>
      <input type="text" placeholder='Enter Your Name' required className='p-2 outline-none rounded-md border-[1px] border-[#5f5f5f] border-solid' onChange={(e)=>{setName(e.target.value)}}/>
      <input type="email" placeholder='Enter Your Gmail' required className='p-2 outline-none rounded-md border-[1px] border-[#5f5f5f] border-solid'  onChange={(e)=>{setEmail(e.target.value)}}/>
      <input type="number" placeholder='Enter Your Room Number' required className='p-2 outline-none rounded-md border-[1px] border-[#5f5f5f] border-solid'  onChange={(e)=>{setRoom(e.target.value)}}/>
      <button className='p-2 rounded-md outline-none bg-green-600 text-white text-2xl font-bold' onClick={submitForm}>Enter</button>
    </div>
  )
}

export default Home
