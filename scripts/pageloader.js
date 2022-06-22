function pushInnerHTML(html) {
    let content_box = document.getElementById('content_box');
    content_box.innerHTML = html;
}

function loadFile(page, dir) {
    const run_innnerScript = () => {
        
    }

    //let content_box = document.getElementById('content_box');
    //let ajXml = new XMLHttpRequest();
    //ajXml.onreadystatechange = function () {
    //    if (ajXml.readyState == 4 && ajXml.status == 200) {
    //        //console.log(ajXml.responseText)
    //        content_box.innerHTML = ajXml.responseText;
    //        run_innnerScript();
    //        return;
    //    }
    //}

    if (dir == undefined) {
        dir = '/pages/';
    }

    xhr_get(dir + page, (response) => {
        content_box.innerHTML = response;

        let scriptElms = content_box.querySelectorAll('script');
        //console.log(scriptElms);

        for (let i = 0; i < scriptElms.length; i++) {
            let script = scriptElms[i].innerHTML;
            scriptElms[i].remove();
            //console.log([i, script]);
            let loaded_script = document.createElement('script');
            loaded_script.innerHTML = script;
            content_box.appendChild(loaded_script);
        }
    });
    //ajXml.open('GET', dir + page, true);
    //ajXml.send(null);
}


function load_home() {
    loadFile('home.html');
}

function load_profile() {
    loadFile('profile.html');
}

function load_account() {
    loadFile('account.html');
}

function load_settings() {
    pushInnerHTML('ここは、このアプリの設定を表示すんぞ。');
}

function load_help() {
    pushInnerHTML('ねえねえ、助けてほしい？残念！まだありませんｗｗｗｗ');
}

function load_about() {
    loadFile('about.html');
}

function load_releasenotes() {
    loadFile('releasenotes.html');
}