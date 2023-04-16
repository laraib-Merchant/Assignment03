const genreSelect = document.getElementById("genre");
const yearSelect = document.getElementById("year");
const ratingSelect = document.getElementById("rating");
const languageSelect = document.getElementById("language");
let moviesData = [];

const loadData = async () => {
    const response = await fetch("https://raw.githubusercontent.com/laraib-Merchant/Assignment03/main/data.json");
    const data = await response.json();
    //console.log(data);
    const unqLanguage = getUniqueLangauge(data); //this functions get unique languages from json file data   
    const unqGenre = getUniqueGernes(data); //this functions get unique genres from json file data
    const unqYear = getUniqueYear(data); //this functions get unique years from json file data
    const unqRating = getUniqueRating(data); //this functions get unique ratings from json file data
    setGenre(unqGenre); //this function shows the unique genres on ui using DOM
    setLanguage(unqLanguage); //this function shows the unique languages on ui using DOM
    setYear(unqYear); //this function shows the unique years on ui using DOM
    setRating(unqRating); //this function shows the unique ratings on ui using DOM
    moviesData = data;
}

function getUniqueGernes(movieData) {
    try{
        let genres = new Set();                  // Creating a new Set object to store unique genres
        movieData.forEach(movie => {             // Looping through each movie object in the data
            if (Array.isArray(movie.genres)) {   // Check if genres property is an array
                movie.genres.forEach(genre => {  // Looping through each genre array in the movie object
                    genres.add(genre);           // Adding each genre to the Set object
                });
            }
        });
        let uniqueGenres = [...genres];          // Converting the Set object to an array using the spread operator
        //console.log(uniqueGenres);
        return uniqueGenres;
    }
    catch (err) {
        console.log(err);
    }   
}

function getUniqueLangauge(movieData) {
    try{
        let languages = new Set(); 
        movieData.forEach(movie => { 
            languages.add(movie.original_language);
        });
        let uniqueLanguages = [...languages]; 
        //console.log(uniqueLanguages); 
        return uniqueLanguages;
    }
    catch (err) {
        console.log(err);
    }   
}

function getUniqueYear(movieData) {
    try{
        let years = new Set(); 
        movieData.forEach(movie => { 
            years.add(movie.release_date.substr(0,4));
        });
        let uniqueYears = [...years];
        //console.log(uniqueYears); 
        return uniqueYears.sort();
    }
    catch (err) {
        console.log(err);
    }   
}

function getUniqueRating(movieData) {
    try{
        let ratings = new Set(); 
        movieData.forEach(movie => { 
            ratings.add(movie.vote_average);
        });
        let uniqueRatings = [...ratings];
        //console.log(uniqueRatings);
        return uniqueRatings.sort();
    }
    catch (err) {
        console.log(err);
    }   
}


function setGenre(uniqueGenre) {
    uniqueGenre.forEach(obj => {
        const optionElem = document.createElement("option");
        optionElem.value = obj;
        optionElem.innerText = obj;
        genreSelect.appendChild(optionElem);
    });
}

function setLanguage(uniqueLanguage) {
    uniqueLanguage.forEach(obj => {
        const optionLanElem = document.createElement("option");
        optionLanElem.value = obj;
        optionLanElem.innerText = obj;
        languageSelect.appendChild(optionLanElem);
    });
}

function setYear(uniqueYear) {
    uniqueYear.forEach(obj => {
        const optionYearElem = document.createElement("option");
        optionYearElem.value = obj;
        optionYearElem.innerText = obj;
        yearSelect.appendChild(optionYearElem);
    });
}

function setRating(uniqueRating) {
    uniqueRating.forEach(obj => {
        const optionRatingElem = document.createElement("option");
        optionRatingElem.value = obj;
        optionRatingElem.innerText = obj;
        ratingSelect.appendChild(optionRatingElem);
    });
}

function filterRecommendations() {

    //getting values here
    const genre = genreSelect.value;
    const year = yearSelect.value;
    const rating = ratingSelect.value;
    const language = languageSelect.value;

    //filtering data here according to user applied filters
    const filteredData = moviesData.filter(movie => {
        return (genre === "all" || movie.genres.includes(genre)) &&
          (year === "all" || movie.release_date.substr(0,4) === year) &&
          (rating === "all" || movie.vote_average.toString() === rating) &&
          (language === "all" || movie.original_language === language);
    });
    //console.log(typeof filteredData); 
    //console.log(filteredData); 

    // here we are sorting filtered data on rating in decending order, highest rated will be ranked 1st.
    filteredData.sort((a, b) => {
        if (a.vote_average > b.vote_average) {
          return -1;
        }
        if (a.vote_average < b.vote_average) {
          return 1;
        }
        return 0;
      });
    
    updateTabe(filteredData);
    
}

function updateTabe(filteredData) {

    const tableBody = document.querySelector("#recommendations tbody");
    tableBody.innerHTML = "";

    filteredData.forEach((movie, index) => {
        const row = document.createElement("tr");

        const rankCell = document.createElement("td");
        rankCell.textContent = index + 1;
        row.appendChild(rankCell);

        const titleCell = document.createElement("td");
        titleCell.textContent = movie.title;
        row.appendChild(titleCell);

        const desCell = document.createElement("td");
        desCell.textContent = movie.overview;
        row.appendChild(desCell);

        const yearCell = document.createElement("td");
        yearCell.textContent = movie.release_date.substr(0,4);
        row.appendChild(yearCell);

        const ratingCell = document.createElement("td");
        ratingCell.textContent = movie.vote_average;
        row.appendChild(ratingCell);

        const languageCell = document.createElement("td");
        languageCell.textContent = movie.original_language;
        row.appendChild(languageCell);

        const genreCell = document.createElement("td");
        if (Array.isArray(movie.genres)) {
            genreCell.textContent = movie.genres.join(", ");
        } else {
            genreCell.textContent = movie.genres;
        }
        row.appendChild(genreCell);

        tableBody.appendChild(row);
    });
}

loadData();

//here we are adding event listner on select tag change values, on change filterRecommendations functions is called

genreSelect.addEventListener("change", filterRecommendations);
yearSelect.addEventListener("change", filterRecommendations);
ratingSelect.addEventListener("change", filterRecommendations);
languageSelect.addEventListener("change", filterRecommendations);