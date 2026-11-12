const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchType = document.getElementById("search-type");
const searchButton = document.getElementById("search-button");

const bookResults = document.getElementById("book-results");
const searchMessage = document.getElementById("search-message");
const resultsCount = document.getElementById("results-count");


// Add an event listener to the search form
searchForm.addEventListener("submit", function(event) {

    // Prevent the page from reloading
    event.preventDefault();

    // Get the search word and selected search type
    const searchTerm = searchInput.value.trim();
    const selectedType = searchType.value;

    // Check that the search field is not empty
    if (searchTerm === "") {
        searchMessage.textContent = "Please enter a search word.";
        return;
    }

    // Start the book search
    searchBooks(searchTerm, selectedType);

});


// Function for searching books from Open Library API
async function searchBooks(searchTerm, selectedType) {

    // Clear previous search results
    bookResults.replaceChildren();
    resultsCount.textContent = "";

    // Show loading message
    searchMessage.textContent = "Searching for books...";
    searchButton.disabled = true;

    try {

        // Create the API URL based on the selected search type
        const apiUrl = `https://openlibrary.org/search.json?${selectedType}=${encodeURIComponent(searchTerm)}&fields=key,title,author_name,first_publish_year,cover_i,edition_count&limit=12`;

        // Fetch data from the API
        const response = await fetch(apiUrl);

        // Check if the request was successful
        if (!response.ok) {
            throw new Error("Unable to fetch book data.");
        }

        // Convert the response into JSON format
        const data = await response.json();

        // Save the returned books into a variable
        const books = data.docs;

        // Check if any books were found
        if (books.length === 0) {
            searchMessage.textContent = "No books found. Try another search.";
            return;
        }

        // Show the number of results
        searchMessage.textContent = "Here are your search results!";
        resultsCount.textContent = `${data.numFound.toLocaleString()} books found`;

        // Display the books
        displayBooks(books);

    } catch (error) {

        // Show an error message if something goes wrong
        console.error("Error:", error);

        searchMessage.textContent =
            "Something went wrong. Please try again.";

    } finally {

        // Enable the search button again
        searchButton.disabled = false;

    }

}


// Function for displaying books on the page
function displayBooks(books) {

    // Loop through all books returned by the API
    books.forEach(function(book) {

        // Create a new book card
        const card = document.createElement("article");
        card.classList.add("book-card");

        // Create the book cover image
        const cover = document.createElement("img");
        cover.classList.add("book-cover");

        // Check if the book has a cover image
        if (book.cover_i) {

            // Create the cover image URL
            cover.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;

        } else {

            // Use a placeholder if no cover is available
            cover.src = "https://placehold.co/300x450/F6E2E5/49363B?text=No+Cover";

        }

        // Add alternative text to the image
        cover.alt = `Cover of ${book.title || "Untitled book"}`;

        // Create the book title
        const title = document.createElement("h3");
        title.classList.add("book-title");
        title.textContent = book.title || "Untitled book";

        // Create the author information
        const author = document.createElement("p");
        author.classList.add("book-author");

        if (book.author_name && book.author_name.length > 0) {
            author.textContent = `By ${book.author_name.slice(0, 2).join(", ")}`;
        } else {
            author.textContent = "Author unknown";
        }

        // Create the publication year
        const year = document.createElement("p");
        year.classList.add("book-year");

        year.textContent = book.first_publish_year
            ? `First published: ${book.first_publish_year}`
            : "Publication year unknown";

        // Create a link to the book on Open Library
        const link = document.createElement("a");
        link.classList.add("book-link");

        link.href = `https://openlibrary.org${book.key}`;
        link.textContent = "View book →";
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        // Add all elements to the book card
        card.appendChild(cover);
        card.appendChild(title);
        card.appendChild(author);
        card.appendChild(year);
        card.appendChild(link);

        // Add the completed card to the results section
        bookResults.appendChild(card);

    });

}
