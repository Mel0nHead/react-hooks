// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorage(initialValue, keyName) {
  const getInitialValue = () => {
    try {
      return JSON.parse(window.localStorage.getItem(keyName)) || initialValue
    } catch (e) {
      return initialValue
    }
  }

  const [value, setValue] = React.useState(getInitialValue)

  React.useEffect(() => {
    try {
      const stringifiedValue = JSON.stringify(value)
      window.localStorage.setItem(keyName, stringifiedValue)
    } catch (e) {
      window.localStorage.setItem(keyName, value)
    }
  }, [value, keyName])

  return [value, setValue]
}

function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') || initialName
  const [name, setName] = useLocalStorage(initialName, 'name')

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
