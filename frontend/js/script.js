// DOM VARIABLES
const userIdentifier = document.querySelector("#userIdentifier");
const passIdentifier = document.querySelector("#passIdentifier");

const bookSection = document.getElementById("bookSection");
const audioSection = document.getElementById("audioSection");
const headerLogin = document.querySelector(".login-btn");
const userInfo = document.querySelector(".userInfo");

const loginTitle = document.querySelector(".loginTitle");
const loginForm = document.querySelector(".loginForm");
const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logout-btn");
const checkMe = document.querySelector("#checkMe");


// LOGIN
loginBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      let response = await axios.post("http://localhost:1337/api/auth/local", {
            identifier: userIdentifier.value,
            password: passIdentifier.value
      });
            console.log(response);
            sessionStorage.setItem("token", response.data.jwt);
            window.location.href = "index.html";
});

// CHECK LOGIN STATUS
const checkLoginstatus = () => {
      if(sessionStorage.getItem("token")) {
            loginTitle.innerHTML = "Inloggad";
            loginForm.remove();
            headerLogin.remove();
            logoutBtn.classList.remove("hidden");
            bookSection.classList.remove("hidden");
            audioSection.classList.remove("hidden");

            renderBooks();
      }
}

// OUTPUTS ALL BOOKS
const renderBooks = async () => {
            let books = await axios.get('http://localhost:1337/api/books?populate=*', {
                  headers: {
                        Authorization:`Bearer ${sessionStorage.getItem("token")}`
                  }
            });

            console.log(books.data);

            books.data.data.forEach(book => {

                  bookSection.innerHTML += `
                        <div class="book-container">
                        <div class="book-text-box">
                        <p class="book-info book-title">${book.attributes.title}</p>
                        <p class="book-info book-author">Av: ${book.attributes.author}</p>
                        <p class="book-info">Betyg: ${book.attributes.rating}</p>
                        <p class="book-info">Sidor : ${book.attributes.pages}</p>
                        <p class="book-info">Genre: ${book.attributes.genres.data[0].attributes.name}</p>
                        <div class="lender-box">
                        <p class="book-info book-lender">Ägare: ${book.attributes.user.data.attributes.username}</p>
                        <p class="book-info lender-mail">e-mail: ${book.attributes.user.data.attributes.email}</p>
                        </div>
                        </div>
                        <img class="book-img" width="110" height="170" style="margin-top:7px" alt="${book.attributes.title}" src="http://localhost:1337${book.attributes.cover.data.attributes.url}">
                        </div>`;
            });

            let audioBooks = await axios.get('http://localhost:1337/api/audiobooks?populate=*', {
                  headers: {
                        Authorization:`Bearer ${sessionStorage.getItem("token")}`
                  }
            });

            console.log(audioBooks.data);

            audioBooks.data.data.forEach(audio => {
                  audioSection.innerHTML += `
                        <div class="book-container">
                        <div class="book-text-box">
                        <p class="book-info book-title">${audio.attributes.title}</p>
                        <p class="book-info book-author">Av: ${audio.attributes.author}</p>
                        <p class="book-info">Betyg: ${audio.attributes.rating}</p>
                        <p class="book-info">Längd: ${audio.attributes.duration} h</p>
                        <p class="book-info">Utgiven: ${audio.attributes.releaseDate}</p>
                        <p class="book-info">Genre: ${audio.attributes.genres.data[0].attributes.name}</p>
                        <div class="lender-box">
                        <p class="book-info book-lender">Ägare: ${audio.attributes.user.data.attributes.username}</p>
                        <p class="book-info lender-mail">e-mail: ${audio.attributes.user.data.attributes.email}</p>
                        </div>
                        </div>
                        <img class="book-img" width="110" height="170" alt="${audio.attributes.title}" src="http://localhost:1337${audio.attributes.cover.data.attributes.url}">
                        </div>`;
            });
      }

      // PROFILE INFO
      checkMe.addEventListener("click", async (e) => {
            e.preventDefault();
            
            if(!sessionStorage.getItem("token")){
                  window.location = "register.html";
            }

      let response = await axios.get("http://localhost:1337/api/users/me",
      {
            headers: {
                  Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
      }) 
      console.log(response);
      bookSection.classList.add("hidden");
      audioSection.classList.add("hidden");
      loginTitle.classList.add("hidden");
      let userData = response.data;
      let reducedDate = userData.createdAt.slice(0, 10);

            userInfo.innerHTML += ` <h1 class="userName pageTitle">Välkommen tillbaka ${userData.username}</h1>
                  <div class="infoText">
                  <p class="user">Namn: ${userData.username}</p>
                  <p class="userEmail">Mail: ${userData.email}</p>
                  <p class="userId">Id: ${userData.id}</p>
                  <p class="userCreated">Medlem sedan: ${reducedDate}</p>
                  </div>
                  <div class="userBooks">
                  <p class="book-section-header">Dina Böcker</p>
                  </div>`;
                  
                  checkMe.style.visibility = "hidden";
});

checkLoginstatus();

// LOGOUT
logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.reload();
      sessionStorage.clear();
})




