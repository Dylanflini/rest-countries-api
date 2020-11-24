// https://restcountries.eu/rest/v2/name/Estonia

const URL = "https://restcountries.eu/rest/v2/all",
  DEFAULT_SELECT = 'Filter by Region'

const inputStore = store("")
const selectStore = store(DEFAULT_SELECT)
const countryFilter = store([])

const countriesContainer = document.querySelector('#country-container')
const countryInput = document.querySelector('#country-input')


const regionSelect = document.querySelector('#filter')

const countryForm = document.querySelector('#country-form')
countryForm.addEventListener('submit', e => { e.preventDefault() })


async function fetchCountries(URL) {
  const response = await fetch(URL)
  return await response.json()
}


function createCountry(name, src, population, region, capital) {
  const container = document.createElement('div')
  container.classList.add('country')

  const img = document.createElement('img')
  img.src = src;
  img.alt = name;
  img.classList.add('country__image')

  const title = document.createElement('h2')
  title.textContent = name
  title.classList.add('country__title')

  container.appendChild(img)
  container.appendChild(title)

  const description = createCountryDescription(['Population: ', 'Region: ', 'Capital: '], [population, region, capital])

  container.appendChild(description)

  return container;
}


function createCountryDescription(names, texts) {

  const descriptionContainer = document.createElement('div')
  descriptionContainer.classList.add('country__description')

  const containers = names.map((name, index) => {

    const container = document.createElement('div')
    container.classList.add('country__text-container')

    const text1 = document.createElement('span')
    text1.textContent = name
    text1.classList.add('country__text--black')

    const text2 = document.createElement('span')
    text2.textContent = texts[index]
    text2.classList.add('country__text')

    container.appendChild(text1)
    container.appendChild(text2)

    return container
  })

  containers.forEach(container => {
    descriptionContainer.appendChild(container)
  })

  return descriptionContainer;

}


function inputFilter(name, region, selectRegion, text) {

  if (selectRegion === DEFAULT_SELECT) {
    return name.toLowerCase().includes(text)
  } else {
    return name.toLowerCase().includes(text) && selectRegion === region
  }

}


function updateCountries(value, region, countriesContainer, allCountries) {

  let lowerCaseText = ""
  if (value != "") {
    lowerCaseText = value.toLowerCase()
  } else {
    lowerCaseText = value
  }

  deleteAllChildNode(countriesContainer)

  const countryFound = allCountries.filter(element => inputFilter(element.name, element.region, region, lowerCaseText))

  countryFound.forEach(country => {
    countriesContainer.appendChild(createCountry(country.name, country.flag, country.population, country.region, country.capital))
  })
}


function deleteAllChildNode(parent) {
  parent.querySelectorAll('*').forEach(n => n.remove());
}


async function main() {
  const allCountries = await fetchCountries(URL)

  updateCountries(inputStore.getState(), DEFAULT_SELECT, countriesContainer, allCountries)

  inputStore.subscribe(value => {
    updateCountries(value, selectStore.getState(), countriesContainer, allCountries)
  })

  function handleInput(e) {
    inputStore.set(e.target.value)
  }
  countryInput.addEventListener('input', handleInput)


  selectStore.subscribe(value => {
    updateCountries(inputStore.getState(), value, countriesContainer, allCountries)
  })

  function handleSelect(e) {
    selectStore.set(e.target.value)
  }
  regionSelect.addEventListener('input', handleSelect)

}

main()