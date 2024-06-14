
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './Home'
import Room from './Room'

function App() {


  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/room/:room' element={<Room/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
