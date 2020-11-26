// https://restcountries.eu/rest/v2/name/Estonia

import { store } from './store'

import { render } from './renderCountries'


async function fetchCountries ( URL ) {
  const response = await fetch( URL )
  return await response.json()
}


function inputFilter ( currentInput, currentRegion, countryName, countryRegion, defaultRegion ) {

  if ( currentRegion === defaultRegion ) {
    return countryName.toLowerCase().includes( currentInput )
  } else {
    return countryName.toLowerCase().includes( currentInput.toLowerCase() ) && countryRegion === currentRegion
  }

}


function lazyload () {

  if ( 'loading' in HTMLImageElement.prototype ) {
    const images = document.querySelectorAll( "img.lazyload" );
    images.forEach( img => {
      img.src = img.dataset.src;
    } );
  } else {
    import( './lazysizes.js' )
  }

}


async function main () {

  const URL = "https://restcountries.eu/rest/v2/all",
    DEFAULT_SELECT = 'Filter by Region',
    limit = 20,
    inputEvent = 'input',
    inputStore = store( "" ),
    selectStore = store( DEFAULT_SELECT ),
    offsetStore = store( 0 ),
    countriesContainer = document.querySelector( '#country-container' ),
    countryInput = document.querySelector( '#country-input' ),
    regionSelect = document.querySelector( '#filter' ),
    countryForm = document.querySelector( '#country-form' );

  countryForm.addEventListener( 'submit', e => { e.preventDefault() } )

  const allCountries = await fetchCountries( URL )

  offsetStore.subscribe( ( _, prev ) => {

    const found = allCountries.filter( element => inputFilter(
      inputStore.getState(),
      selectStore.getState(),
      element.name,
      element.region,
      DEFAULT_SELECT
    ) )

    if ( prev <= allCountries.length ) {

      const noDisplay = allCountries.filter( element => !inputFilter(
        inputStore.getState(),
        selectStore.getState(),
        element.name,
        element.region,
        DEFAULT_SELECT
      ) )


      let fn = () => { }

      if ( found.length > limit ) {
        fn = () => offsetStore.set( offsetStore.getState() + limit )
      }

      render( countriesContainer, found, offsetStore.getState(), fn, noDisplay )

    }

    lazyload()

  } )

  countryInput.addEventListener( inputEvent, function () {
    inputStore.set( this.value.toLowerCase() )
    offsetStore.set( limit )

  } )

  regionSelect.addEventListener( inputEvent, function () {
    selectStore.set( this.value )
    offsetStore.set( limit )
  } )

  offsetStore.set( limit )

}

main()
