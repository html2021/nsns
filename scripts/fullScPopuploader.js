function fullScPopup_open(content_path) {
    let fullScPopup = document.getElementById('fullScPopup');

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let fullScPopup_content = document.getElementById('fullScPopup_content');
            fullScPopup.innerHTML = xhr.responseText;
            fullScPopup.classList.add('fullScPopup_open');
            return;
        }
    }
    xhr.open('GET', content_path, true);
    xhr.send(null);
}

function fullScPopup_close() {
    let fullScPopup = document.getElementById('fullScPopup');
    fullScPopup.innerHTML = '';
    fullScPopup.classList.remove('fullScPopup_open');
}

function open_login() {
    fullScPopup_open('/fullScPopup/login.html');
}