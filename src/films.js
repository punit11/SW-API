import React from 'react'
import People from './people'
import './people.css'

export default class Films extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      loading: true,
      film: [],
      selectValue: '',
      peopleIdstr: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
        selectValue: event.target.value,
        peopleIdstr: event.target[event.target.selectedIndex].getAttribute("data-peopleid")
    });
  }

  componentDidMount() {
    this.mounted = true
    this.fetchFilms()
  }

  componentWillUnmount() {
    this.mounted = false
  }

  async fetchFilms() {
    let film = []
    let error = null

    this.setState({ film, error, loading: true })

    try {
      const response = await fetch('https://swapi.co/api/films/?format=json')
      if (!response.ok) {
        new Error('Unable to fetch people')
      }

      const body = await response.json()

      film = body.results
    } catch (err) {
      error = err
    }

    if (!this.mounted) {
      return
    }
    this.setState({ film, error, loading: false })
  }

  render() {
    // console.log('Selected Movie', this.state.selectValue);
    const { loading, film, error } = this.state;

    return (
      <div className='StarWarsPeople' data-testid='star-wars-film-container'>
        <h1 data-testid='header'>Star Wars Films</h1>

        {loading && (
          <p className='loading' data-testid='loading-indicator'>
            Loading...
          </p>
        )}

        {!loading && !error && (
          <div>
                    
        <select value={this.state.selectValue} onChange={this.handleChange}>
        <option data-peopleid='' value=''>Select a movie</option>
        {film.map(({ url, title, characters }) => (
          <option key={url} data-peopleid={characters.map(val => {let x=val.split("/"); return parseInt(x[x.length-2])})} value={title}>{title}</option>
          ))}
        </select>     

        {(this.state.peopleIdstr) ? <People peopleList = {this.state.peopleIdstr} /> :''}

       </div>
        )}

        {error && (
          <pre className='error' data-testid='error'>
            {error.toString()}
          </pre>
        )}
      </div>
    )
  }
}
