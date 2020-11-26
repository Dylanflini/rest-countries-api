import { createCountry } from './createCountry'


function getCountriesAreInDOM ( countriesToCheck, container ) {

  const elements = countriesToCheck.filter( ( { name } ) => isCountryInDOM( name, container ) )
  return getElementsInDOM( elements )

}


function getCountriesAreNotInDOM ( countriesToCheck, container ) {

  return countriesToCheck.filter( ( { name } ) => !isCountryInDOM( name, container ) )

}


function isCountryInDOM ( id ) {
  return document.getElementById( id ) === null ? false : true
}


function mountInDOM ( elements, container ) {

  if ( elements.length > 0 ) {

    return elements.map( country =>
      container.appendChild( createCountry( country.name, country.flag, country.population, country.region, country.capital ) )
    )

  }

  return []

}


function addDisplay ( elements, displayClass ) {

  if ( elements !== undefined ) {
    elements.forEach( element => {
      element.classList.add( displayClass )
    }
    )
  }

}


function getLastCountryRender () {

  const x = document.querySelectorAll( '.country--display' )
  if ( x.length > 1 )
    return x[ x.length - 1 ]

  return null
}


function addObserver ( lastElement, action ) {

  if ( lastElement !== null ) {

    let options = {
      rootMargin: '0px',
      threshold: 0.5,
    }

    function callback ( entries ) {

      entries.forEach( ( { isIntersecting } ) => {
        if ( isIntersecting ) {
          action()
          this.disconnect()
        }
      } )

    }

    const observer = new IntersectionObserver( callback, options )
    observer.observe( lastElement )

  }

}


function removeDisplay ( elements, displayClass ) {

  if ( elements !== undefined ) {
    elements.forEach( element => {
      element.classList.remove( displayClass )
    }
    )
  }

}


function getElementsInDOM ( list ) {
  return list.map( ( element ) => document.getElementById( element.name ) )

}


export function render ( countriesContainer, entryCountries, limit = 20, actionObserver = () => { }, noDisplay = [] ) {

  const holaaa = getCountriesAreInDOM( noDisplay, countriesContainer )

  removeDisplay( holaaa, 'country--display' )

  const sliceCountries = entryCountries.slice( 0, limit );

  const countriesAreNotInDOM = getCountriesAreNotInDOM( sliceCountries, countriesContainer )

  const countriesMounted = mountInDOM( countriesAreNotInDOM, countriesContainer )

  addDisplay( [ ...countriesMounted, ...getCountriesAreInDOM( sliceCountries, countriesContainer ) ], 'country--display' )

  const lastCountryRender = getLastCountryRender( countriesContainer )

  addObserver( lastCountryRender, actionObserver )

}