const miformulario = document.querySelector('form');

const url = (window.location.hostname.includes('localhost')) ?
    'http://localhost:8080/api/auth/' :
    'https://socket-chat-intro.herokuapp.com/api/auth/';


miformulario.addEventListener('submit', event => {
    event.preventDefault();
    const formDataa = {};

    for (let el of miformulario.elements) {
        if (el.name.length > 0) {
            formDataa[el.name] = el.value;
        }
    }

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formDataa),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(resp => resp.json())
        .then(({msg, token})=> {
            if(msg){
                return console.log(msg);
            }
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(err => {
            console.log(err);
        });
});

function handleCredentialResponse(response) {

    //Google Token : ID_TOKEN

    //console.log('id_token', response.credential);

    const body = {
        id_token: response.credential
    };

    fetch(url + 'google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(resp => resp.json())
        .then(({ token }) => {
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(console.warn());

}

const button = document.getElementById('google_signout');
button.onclick = () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    });
}