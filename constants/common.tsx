const fetchMoviesData = async (API:string) => {
    try {
      const response = await fetch(API)
      const movieData = await response.json()
      return movieData
    } catch (error) {
      console.log(error)
    }

  }
export default fetchMoviesData