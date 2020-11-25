// https://restcountries.eu/rest/v2/name/Estonia

import { store } from './store.js'
import './lazysizes.js'

async function fetchCountries ( URL ) {
  const response = await fetch( URL )
  return await response.json()
}


function createCountry ( name, src, population, region, capital ) {
  const container = document.createElement( 'div' )
  container.classList.add( 'country' )

  // 2<img data-src="image-gato2.jpg" loading="lazy" alt=".." class="lazyload"/>

  const img = document.createElement( 'img' )
  // img.src = src;
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

  const description = createCountryDescription( [ 'Population: ', 'Region: ', 'Capital: ' ], [ population, region, capital ] )

  container.appendChild( description )

  return container;
}


function createCountryDescription ( names, texts ) {

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

    container.appendChild( text1 )
    container.appendChild( text2 )

    return container
  } )

  containers.forEach( container => {
    descriptionContainer.appendChild( container )
  } )

  return descriptionContainer;

}


function inputFilter ( name, region, selectRegion, text, defaultRegion ) {

  if ( selectRegion === defaultRegion ) {
    return name.toLowerCase().includes( text )
  } else {
    return name.toLowerCase().includes( text ) && selectRegion === region
  }

}


function updateCountries ( value, region, countriesContainer, allCountries, defaultRegion ) {

  let lowerCaseText = ""
  if ( value !== "" ) {
    lowerCaseText = value.toLowerCase()
  } else {
    lowerCaseText = value
  }

  deleteAllChildNode( countriesContainer )

  const countryFound = allCountries.filter( element => inputFilter( element.name, element.region, region, lowerCaseText, defaultRegion ) )

  countryFound.forEach( country => {
    countriesContainer.appendChild( createCountry( country.name, country.flag, country.population, country.region, country.capital ) )
  } )
}


function deleteAllChildNode ( parent ) {
  parent.querySelectorAll( '*' ).forEach( n => n.remove() );
}


function lazyload () {
  // if ( 'loading' in HTMLImageElement.prototype ) {
  //   // Si el navegador soporta lazy-load, tomamos todas las imágenes que tienen la clase
  //   // `lazyload`, obtenemos el valor de su atributo `data-src` y lo inyectamos en el `src`.
  //   const images = document.querySelectorAll( "img.lazyload" );
  //   images.forEach( img => {
  //     img.src = img.dataset.src;

  //   } );

  // } else {
  //   // Importamos dinámicamente la libreria `lazysizes`
  //   let script = document.createElement( "script" );
  //   script.async = true;
  //   // script.src = "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.2.0/lazysizes.min.js";
  //   script.src = "/lazysizes.js";
  //   // 
  //   document.body.appendChild( script );
  // }

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

  updateCountries( inputStore.getState(), DEFAULT_SELECT, countriesContainer, allCountries, DEFAULT_SELECT )

  inputStore.subscribe( value => {
    updateCountries( value, selectStore.getState(), countriesContainer, allCountries, DEFAULT_SELECT )
    lazyload()
  } )

  countryInput.addEventListener( 'input', function () {
    inputStore.set( this.value )
  } )

  selectStore.subscribe( value => {
    updateCountries( inputStore.getState(), value, countriesContainer, allCountries, DEFAULT_SELECT )
    lazyload()
  } )

  regionSelect.addEventListener( 'input', function () {
    selectStore.set( this.value )
  } )

  lazyload()

}

main()