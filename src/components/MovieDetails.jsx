import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { IoIosArrowDropleftCircle } from "react-icons/io"
import { IoStar } from "react-icons/io5"
import "./MovieDetails.css"

export const MovieDetails = () => {
  const [movieDetails, setMovieDetails] = useState()
  const [loading, setLoading] = useState(true) // New state variable for loading
  const [error, setError] = useState(false) // New state variable for error

  const apiEnv = import.meta.env.VITE_OPENDB_KEY
  const params = useParams()
  const movieId = params.slug
  const movieURL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiEnv}&language=en-US`

  useEffect(() => {
    const fetchMovieDetails = () => {
      setLoading(true)
      setError(false)
      fetch(movieURL)
        .then((response) => {
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error("Movie not found")
            } else {
              throw new Error("Failed fetching movie")
            }
          }
          return response.json()
        })
        .then((json) => {
          setMovieDetails(json)
        })
        .catch((error) => {
          console.error("Error fetching movies:", error)
          setError(true)
        })
        .finally(() => {
          setLoading(false)
        })
    }

    fetchMovieDetails()
  }, [movieURL])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Movie not found</div>
  }

  if (!movieDetails) {
    return <div>There is an error fetching movies</div>
  }

  return (
    <div className="detail-page">
      <Link to={"/"}>
        <div className="back-arrow">
          <IoIosArrowDropleftCircle className="back-icon" />
          <p className="back-text">Back to all movies</p>
        </div>
      </Link>
      <div
        className="background"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0) 70%, rgba(0,0,0) 100%), url(https://image.tmdb.org/t/p/w1280${movieDetails.backdrop_path})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          minWidth: "100vw",
        }}>
        <div className="details-container">
          <div className="poster-container">
            <img
              className="detail-poster"
              src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
              alt={`Movie poster for ${movieDetails.title}`}
            />
          </div>
          <div className="text-container">
            <h1>
              <span className="title">{movieDetails.title}</span>
              <div className="rating-container">
                <span className="rating">
                  <IoStar className="rating-icon" />
                  {movieDetails.vote_average.toFixed(1)}
                </span>
              </div>
            </h1>
            <p className="summary">{movieDetails.overview}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
