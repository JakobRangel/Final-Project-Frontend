const mode = 1;

const host_local = "http://localhost:8080";
const host_remote = "https://final-project-2f2a.onrender.com";

function getHost() {
    return (mode == 0) ? host_local : host_remote;
}

function isLoggedIn() {
    if(localStorage.getItem("token")) {
        return true;
    } else {
        return false;
    }
}

function getTheToken() {
    return localStorage.getItem("token");
}

function saveTheToken(token) {
    localStorage.setItem("token", token);
}

function removeTheToken() {
    localStorage.removeItem("token");
}

let configuration = {
    isLoggedIn: () => isLoggedIn(),
    host: () => getHost(),
    token: () => getTheToken(),
    customerId: () => getCustomerId(),
};

async function login() {
    let username = document.getElementById("user-signin").value;
    let password = document.getElementById("password-signin").value;
    let customer = {username: username, password: password};
    let request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(customer)
    };
    try {
        let response = await fetch(getHost() + "/login", request);
        if (response.status === 200) {
            const data = await response.json();
            if (data.token && data.customerId) {
                alert("The login was successful!");
                saveTheToken(data.token); // Save the token
                saveCustomerId(data.customerId); // Save the customerId
                location.href = "index.html"; // Redirect to the homepage
                console.log(getTheToken());
            } else {
                throw new Error("Invalid login response.");
            }
        } else {
            console.log(`response status:${response.status}`);
            removeTheToken();
            alert("Login failed. Please check your username and password.");
        }
    } catch(error) {
        console.log(error);
        removeTheToken();
        alert("Something went wrong during login!");
    }
}

function saveCustomerId(customerId) {
    localStorage.setItem("customerId", customerId);
}

function getCustomerId() {
    return localStorage.getItem("customerId");
}

function removeCustomerId() {
    localStorage.removeItem("customerId");
}

async function signup() {
    let username = document.getElementById("user").value;
    let password = document.getElementById("password").value;
    let customer = {username:username, password: password}
    let request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(customer)
      };
      try {
        let response = await fetch(getHost() + "/signup", request);
        if(response.status == 200) {  
            alert("The registration was successful!")
            location.href = "login.html";

        } else {
            console.log(`response status:${response.status}`);            
            alert("Something went wrong!");
        }
      }
      catch(error) {
        console.log(error);        
        alert("Something went wrong!");
      }    
}

async function logout() {
    removeTheToken();
}