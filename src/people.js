import React from 'react'
// import './People.css'

export default class People extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      loading: true,
      // people: [],
      actors : {},
      ship : {}
    }
  }

  componentDidMount() {
    this.mounted = true
    let passedActorIds = this.props.peopleList;
    // var passedActorIds_ints = passedActorIds.split(',').map(Number);
    let passedActorIdsArr = passedActorIds.split(',').map(Number);
    passedActorIdsArr.forEach(val => {return this.fetchPeople(val)});
    // passedActorIdsArr.forEach((val) => console.log('val -------- ',val));
  }

  componentWillReceiveProps() {
      // Delete state to rerender properly
    for (var key in this.state.actors) {
          delete this.state.actors[key];
      }
    let passedActorIds = this.props.peopleList;
    let passedActorIdsArr = passedActorIds.split(',').map(Number);
    passedActorIdsArr.forEach(val => {return this.fetchPeople(val)});
}

  componentWillUnmount() {
    this.mounted = false
  }

  async fetchPeople(actorId) {
    let error = null
    this.setState({ error, loading: true })

    try {
    //   var actors = {};
      let response = await fetch(`https://swapi.co/api/people/${actorId}/?format=json`)
      if (!response.ok) {
        new Error('Unable to fetch people')
      }

      const body =  await response.json()
    //   console.log('body.name: ',body.name);
    //   people = body
    // var ships = body.starships;
    var timestamp = (new Date()).getTime();

    // update and set the actors state object
    this.state.actors['name-' + timestamp ] = body.name;
    this.setState({ actors : this.state.actors });

    // update and set the starships state object
    // this.state.ship['ship-' + timestamp ] = body.starships;
    // this.setState({ ship : this.state.ship });

    //   console.log('people 1: ', mergedPeopleList);
    } catch (err) {
      error = err
    }

    if (!this.mounted) {
      return
    }
    this.setState({ error, loading: false })
  }

  render() {
    const { loading, actors,  error } = this.state
    return (
      <div className='StarWarsPeople' data-testid='star-wars-people-container'>
        <h2 data-testid='header'>Star Wars People</h2>

        {loading && (
          <p className='loading' data-testid='loading-indicator'>
            Loading...
          </p>
        )}

        {!loading && !error && (
          <div>
          <ul data-testid='people-list'>
            {
            Object.keys(actors).map(function(key) {
                var timestamp = (new Date()).getTime();
                // console.log(key, actors[key]);
                return (
                 <li key={actors[key]+timestamp} >{actors[key]}
                  {/* <Ships shipList = {this.state.shipIdstr} /> */}
                </li>
                )
            })
            }
          </ul>
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
