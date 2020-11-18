function signin() {
    var email = document.getElementById('inputEmail').value;
    var password= document.getElementById('inputPassword').value;

    if (email == 'toby.samples@gmail.com' && password == 'testpass'){
        localStorage.setItem('name', 'Toby');
        location.href = 'index.html';
    } 
    

    if (email == 'john.smith@gmail.com' && password == 'testpass'){
        localStorage.setItem('name', 'John');
        location.href = 'index.html';
    } 
    
    else {
        alert('Error:  Incorrect Username or password');
    }
}

function signout() {
    localStorage.removeItem('name');
    location.href = "login.html";
}

if (localStorage.getItem('name') != null) {
    $('.signin-bar').show();
    $('#welcome-msg').text('Welcome ' + localStorage.getItem('name'));
}