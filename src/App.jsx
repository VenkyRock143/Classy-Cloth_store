import { useState } from 'react'
import './App.css'
import ClothingStore from './components/dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <ClothingStore/>
      </div>

    </>
  )
}

export default App
