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

export function createCountry ( name, src, population, region, capital ) {

  const countryDescriptionEntries = [ 'Population: ', 'Region: ', 'Capital: ' ]

  const container = document.createElement( 'div' )
  container.classList.add( 'country' )
  container.id = name

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