const registerForm = document.querySelector("#registerForm")
const registerUsername = document.querySelector("#registerUsername");
const registerEmail = document.querySelector("#registerEmail");
const registerPassword = document.querySelector("#registerPassword");
const registerBtn = document.querySelector("#registerBtn");


// REGISTRATION
registerBtn.addEventListener("click", async (e) =>  {
      e.preventDefault();
      let response =  await axios.post("http://localhost:1337/api/auth/local/register", {
            username: registerUsername.value,   
            email: registerEmail.value,
            password: registerPassword.value
      });
            console.log(response);
            sessionStorage.setItem("token", response.data.jwt);
            window.location = "index.html";

});

checkLoginstatus();