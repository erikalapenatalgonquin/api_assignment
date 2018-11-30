/********************************
Filename: main.js
Author: @erikaPerley
Description: API Project
Date: November 29, 2018
*********************************/

//https://developers.themoviedb.org/3/getting-started/introduction
//https://developers.themoviedb.org/3/configuration/get-api-configuration
//https://api.themoviedb.org/3/configuration?api_key=<c3edfb6f8981a977d97d8e8a1ef75e12>

const movieDataBaseURL = "https://api.themoviedb.org/3/";

let imageURL = null;
let imageSizes = [185];
let searchString = "";

document.addEventListener("DOMContentLoaded", init);

function init() {

    pages = document.querySelectorAll(".page");

    addEventListeners();

    getLocalStorageData();
}

function addEventListeners() {
    let searchButton = document.querySelector(".searchButtonDiv");
    searchButton.addEventListener("click", startSearch);


    document.querySelector("#modalButton").addEventListener("click", showOverlay);
    document
        .querySelector(".cancelButton")
        .addEventListener("click", hideOverlay);
    document.querySelector(".overlay").addEventListener("click", hideOverlay);

    document.querySelector(".saveButton").addEventListener("click", function (e) {
        let cheeseList = document.getElementsByName("cheese");
        let cheeseType = null;
        for (let i = 0; i < cheeseList.length; i++) {
            if (cheeseList[i].checked) {
                cheeseType = cheeseList[i].value;
                break;
            }
        }
        alert(cheeseType);
        console.log("You picked " + cheeseType);
        hideOverlay(e);
    });
}

function getLocalStorageData() {

    getPosterPathAndSizes();
}

function getPosterPathAndSizes() {

    let url = `${movieDataBaseURL}configuration?api_key=${APIKEY}`;

    fetch(url)
        .then(response => response.json())
        .then(function (data) {
            console.log(data);
            imageURL = data.images.secure_base_url;
            imageSizes = data.images.poster_sizes;

            console.log(imageURL);
            console.log(imageSizes);
        })

        .catch(error => console.log(error));

}

function startSearch() {
    console.log("start search");
    searchString = document.getElementById("search-input").value;
    if (!searchString) {
        alert("Please enter search data");
        return
    }

    getSearchResults();
}

function getSearchResults() {

    let url = `${movieDataBaseURL}search/movie?api_key=${APIKEY}&query=${searchString}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            createPage(data);
        })
        .catch(error => console.log(error));
}


function createPage(data) {
    let content = document.querySelector("#search-results>.content");
    let title = document.querySelector("#search-results>.title");

    let message = document.createElement("h2")

    message.classList.add('message');

    content.innerHTML = "";
    title.innerHTML = "";

    if (data.total_results == 0) {
        message.innerHTML = `No results found for ${searchString}`;

    } else {
        message.innerHTML = `Total results = ${data.total_results} for ${searchString}`;
    }

    title.appendChild(message);

    let documentFragment = new DocumentFragment();
    documentFragment.appendChild(createMovieCards(data.results));

    content.appendChild(documentFragment);

    let cardList = document.querySelectorAll(".content>div");

    cardList.forEach(function (item) {
        item.addEventListener("click", getRecommendations);
    });
}


let cardList = document.querySelectorAll(".content>div");

cardList.forEach(function (item) {
    item.addEventListener("click", getRecommendations);

});

function createMovieCards(results) {

    let documentFragment = new DocumentFragment();

    results.forEach(function (movie) {

        let movieCard = document.createElement("div");
        let section = document.createElement("section");
        let image = document.createElement("img");
        let videoTitle = document.createElement("p");
        let videoDate = document.createElement("p");
        let videoRating = document.createElement("p");
        let videoOverview = document.createElement("p");


        videoTitle.textContent = movie.title;
        videoDate.textContent = movie.release_date;
        videoRating.textContent = movie.vote_average;
        videoOverview.textContent = movie.overview;

        image.src = `${imageURL}${imageSizes[2]}${movie.poster_path}`;

        image.setAttribute("onerror", "this.src='/img/no-image.png'");
        image.setAttribute("style", "max-width:185px;");

        movieCard.setAttribute("data-title", movie.title);
        movieCard.setAttribute("data-id", movie.id);

        movieCard.className = "movieCard";
        section.className = "imageSection";


        section.appendChild(image);
        movieCard.appendChild(section);

        const details = document.createElement("div");
        details.classList.add('movie-details');

        videoTitle.classList.add('movie-title');
        videoDate.classList.add('movie-release-date');
        videoRating.classList.add('movie-vote-average');
        videoOverview.classList.add('movie-overview');

        details.appendChild(videoTitle);
        details.appendChild(videoDate);
        details.appendChild(videoRating);
        details.appendChild(videoOverview);

        movieCard.appendChild(details);

        documentFragment.appendChild(movieCard);

    });

    return documentFragment;
}

function getRecommendations() {

    let movieTitle = this.getAttribute("data-title");
    let movieID = this.getAttribute("data-id");
    console.log("you clicked: " + movieTitle + " " + movieID);

    let url = `${movieDataBaseURL}movie/${movieID}/recommendations?api_key=${APIKEY}`;

    fetch(url)
        .then(response => response.json())
        .then((data) => {

            console.log(data);


            createPage(data);

        })
        .catch((error) => console.log(error));
}

function showOverlay(e) {
    e.preventDefault();
    let overlay = document.querySelector(".overlay");
    overlay.classList.remove("hide");
    overlay.classList.add("show");
    showModal(e);
}

function showModal(e) {
    e.preventDefault();
    let modal = document.querySelector(".modal");
    modal.classList.remove("off");
    modal.classList.add("on");
}

function hideOverlay(e) {
    e.preventDefault();
    e.stopPropagation();
    let overlay = document.querySelector(".overlay");
    overlay.classList.remove("show");
    overlay.classList.add("hide");
    hideModal(e);
}

function hideModal(e) {
    e.preventDefault();
    let modal = document.querySelector(".modal");
    modal.classList.remove("on");
    modal.classList.add("off");
}
