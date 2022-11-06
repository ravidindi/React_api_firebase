import React from 'react';
import { useState,useEffect,useCallback } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

function App() {
  const [movies, setmovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const  movieFetchHandler=useCallback(async ()=>{
    setError(null);
    setLoading(true);
    try{
      const response=await fetch('https://react-http-87bf4-default-rtdb.firebaseio.com/movie.json');
      if(!response.ok){
        throw new Error('Something went wrong');
      }
      console.log(response);
      const data=await response.json();
      const loadedMovies=[];
      for(const key in data){
        const d1={
          id:key,
          title:data[key].title,
          openingText:data[key].openingText,
          releaseDate:data[key].releaseDate,

        }
        loadedMovies.push(d1);
      }
      setmovies(loadedMovies);
    }
    catch(error){
      setError(error.message);
    }
    setLoading(false);
  },[]);
  useEffect(() => {
  movieFetchHandler();
  }, [movieFetchHandler])
  
  const addMovieHandler=async (data)=>{
    const response=await fetch('https://react-http-87bf4-default-rtdb.firebaseio.com/movie.json',data);
    //console.log(response);
    movieFetchHandler();
  } 
  let content=<p>Found no movies</p>
  if(error){
    content=<p>{error}</p>
  }
  if(loading)content=<p>Loading....</p>
  if(movies.length>0)content=<MoviesList movies={movies}/>
  return (
    <React.Fragment>
       <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={movieFetchHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
