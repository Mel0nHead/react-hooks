// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hasError: false}
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {hasError: true}
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <strong>
          Something went wrong! Please refresh the page and try again. If the
          problem persists, please contact support.
        </strong>
      )
    }

    return this.props.children
  }
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    pokemon: null,
    error: null,
    status: 'idle',
  })

  React.useEffect(() => {
    if (!pokemonName) return
    setState({
      pokemon: null,
      error: null,
      status: 'pending',
    })
    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState(currentState => ({
          ...currentState,
          pokemon: pokemonData,
          status: 'resolved',
        }))
      })
      .catch(e => {
        setState(currentState => ({
          ...currentState,
          status: 'rejected',
          error: e,
        }))
      })
  }, [pokemonName])

  if (state.status === 'idle') {
    return <strong>Submit a pokemon</strong>
  }

  if (state.status === 'rejected') {
    throw new Error(state.error.message)
  }

  if (state.status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  }

  return <PokemonDataView pokemon={state.pokemon} />
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary key={pokemonName}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
