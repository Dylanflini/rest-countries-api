// https://restcountries.eu/rest/v2/name/Estonia

import { store } from './store.js'


async function fetchCountries ( URL ) {
  const response = await fetch( URL )
  return await response.json()
}


function createCountry ( name, src, population, region, capital ) {

  const countryDescriptionEntries = [ 'Population: ', 'Region: ', 'Capital: ' ]

  const container = document.createElement( 'div' )
  container.classList.add( 'country' )

  const img = document.createElement( 'img' )
  img.setAttribute( 'data-src', src )
  img.setAttribute( 'loading', 'lazy' )
  img.alt = name;
  img.classList.add( 'country__image' )
  img.classList.add( 'lazyload' )

  const title = document.createElement( 'h2' )
  title.textContent = name
  title.classList.add( 'country__title' )

  container.appendChild( img )
  container.appendChild( title )

  const description = createCountryDescription( countryDescriptionEntries, [ population, region, capital ], countryDescriptionEntries[ 1 ] )

  container.appendChild( description )

  return container;
}


function createCountryDescription ( names, texts, region ) {

  const descriptionContainer = document.createElement( 'div' )
  descriptionContainer.classList.add( 'country__description' )

  const containers = names.map( ( name, index ) => {

    const container = document.createElement( 'div' )
    container.classList.add( 'country__text-container' )

    const text1 = document.createElement( 'span' )
    text1.textContent = name
    text1.classList.add( 'country__text--black' )

    const text2 = document.createElement( 'span' )
    text2.textContent = texts[ index ]
    text2.classList.add( 'country__text' )

    if ( name === region ) {
      text2.classList.add( 'region' )
    }

    container.appendChild( text1 )
    container.appendChild( text2 )

    return container
  } )

  containers.forEach( container => {
    descriptionContainer.appendChild( container )
  } )

  return descriptionContainer;

}


function firstRenderCountries ( countriesContainer, allCountries ) {

  allCountries.forEach( country => {
    countriesContainer.appendChild( createCountry( country.name, country.flag, country.population, country.region, country.capital ) )
  } )

  const y = Array.from( countriesContainer.getElementsByClassName( 'country' ) )

  y.forEach( ( element ) => element.classList.add( 'country--display' ) )

}


function inputFilter ( currentInput, currentRegion, countryName, countryRegion, defaultRegion ) {

  if ( currentRegion === defaultRegion ) {
    return countryName.toLowerCase().includes( currentInput )
  } else {
    return countryName.toLowerCase().includes( currentInput.toLowerCase() ) && countryRegion === currentRegion
  }

}


function updateCountries ( currentName, currentRegion, container, defaultRegion ) {

  const countryDisplay = 'country--display'

  const countriesContainer = Array.from( container.getElementsByClassName( 'country' ) )

  countriesContainer.forEach( element => {

    inputFilter(
      currentName,
      currentRegion,
      element.querySelector( 'h2.country__title' ).textContent,
      element.querySelector( 'span.country__text.region' ).textContent,
      defaultRegion
    ) ?
      element.classList.add( countryDisplay )
      :
      element.classList.remove( countryDisplay )
  }

  )
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
    DEFAULT_SELECT = 'Filter by Region'

  const inputStore = store( "" )
  const selectStore = store( DEFAULT_SELECT )

  const countriesContainer = document.querySelector( '#country-container' )
  const countryInput = document.querySelector( '#country-input' )
  const regionSelect = document.querySelector( '#filter' )
  const countryForm = document.querySelector( '#country-form' )

  countryForm.addEventListener( 'submit', e => { e.preventDefault() } )

  const allCountries = await fetchCountries( URL )

  firstRenderCountries( countriesContainer, allCountries )

  inputStore.subscribe( input => {
    updateCountries( input, selectStore.getState(), countriesContainer, DEFAULT_SELECT )
  } )

  selectStore.subscribe( select => {
    updateCountries( inputStore.getState(), select, countriesContainer, DEFAULT_SELECT )
  } )

  countryInput.addEventListener( 'input', function () {
    inputStore.set( this.value )
  } )

  regionSelect.addEventListener( 'input', function () {
    selectStore.set( this.value )
  } )

  lazyload()

}

main()