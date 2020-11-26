function addComa ( array, partOfArray = [] ) {

  if ( array.length <= 3 ) {
    return [ ...partOfArray, ...array ]
  }

  // const newArray = array.slice( 3 )
  // const newPartOfArray = array.slice( 0, 3 )

  return addComa( array.slice( 3 ), [ ...partOfArray, ...array.slice( 0, 3 ), ',' ] )

}


export function formatPopulation ( value ) {
  
  const text = value.toString()
  const textReverse = [ ...text ].reverse()
  return [ ...addComa( textReverse ) ].reverse().join( '' )

}
