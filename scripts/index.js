// localstorageに保存されているユーザー情報を取得
let LoggingInUserId = localStorage.getItem('LoggingInUserId');
console.log(`id is: ${LoggingInUserId}`);
switch (LoggingInUserId) {
    case '': case null: not_loggedin(); break;
    default: loggedin(); break;
}

//database check

window.addEventListener('load', () => {
    document.getElementById('loadingscreen').remove();
});

async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}

function getnowDate(type) {
    //console.log('getNowtime');
    let nowTime = new Date();
    let Day_ = ['San', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    //let nowDate = nowTime.getFullYear().toString().padStart(4, '0') + '/' + (nowTime.getMonth() + 1).toString().padStart(2, '0') + '/' + nowTime.getDate().toString().padStart(2, '0') + ' ' + Day_[nowTime.getDay()];
    let nowYear = nowTime.getFullYear().toString().padStart(4, '0');
    let nowMonth = (nowTime.getMonth() + 1).toString().padStart(2, '0');
    let nowDate = nowTime.getDate().toString().padStart(2, '0');
    let nowDayInt = nowTime.getDay();
    let nowDay = Day_[nowDayInt];

    let nowHour = nowTime.getHours().toString().padStart(2, '0');
    let nowMin = nowTime.getMinutes().toString().padStart(2, '0');
    let nowSec = nowTime.getSeconds().toString().padStart(2, '0');
    let nowMilli = nowTime.getMilliseconds().toString().padStart(3, '0');
    //let msg = '現在は、' + nowHour + ':' + nowMin + ':' + nowSec + '.' + nowMilli + ' です。';
    //let date = `${nowYear}/${nowMonth}/${nowDate} ${nowDay}`;
    //let time = `${nowHour}:${nowMin}:${nowSec}`;
    //let msg = `Now:${nowYear}/${nowMonth}/${nowDate} ${nowDay} ${nowDate} ${nowHour}:${nowMin}:${nowSec}.${nowMilli}`;
    //document.getElementById('realtime').innerHTML = msg;

    //let dateElm = document.getElementById('date');
    //let timeElm = document.getElementById('time');
    //if (dateElm != null && timeElm != null) {
    //    dateElm.innerHTML = date;
    //    timeElm.innerHTML = time;
    //} else {
    //    clearInterval(gettimeint);
    //}
    let returndata;
    if (type == 'keyarr' || type == '' || type == null) {
        returndata = {
            date: {
                year: nowYear,
                month: nowMonth,
                date: nowDate,
                day: nowDay
            },
            time: {
                hour: nowHour,
                min: nowMin,
                sec: nowSec,
                milli: nowMilli
            }
        }
    } else if (type == 'arr') {
        returndata = [nowYear, nowMonth, nowDate, nowDay, nowHour, nowMin, nowSec, nowMilli];
    } else if (type == 'str') {
        returndata = `${nowYear}${nowMonth}${nowDate}${nowDayInt}${nowHour}${nowMin}${nowSec}${nowMilli}`;
    }
    return (returndata);
}

function loggedin() {
    let req = indexedDB.open(LoggingInUserId);
    req.onsuccess = function (e) {
        console.log('ok');
    };
    req.onupgradeneeded = function (e) {
        localStorage.removeItem('LoggingInUserId');
        let db = e.target.result;
        db.close();
        let delreq = indexedDB.deleteDatabase(LoggingInUserId);
        delreq.onsuccess = function (e) {
            console.log('delete success');
            window.location.href = '/';
        }
    };

    let hash = window.location.hash;
    if (hash == '') {
        changePage('home', false);
    } else {
        changePage(hash.substring(1), false);
        console.log(`ログインしています: ${LoggingInUserId}`);
    }
    console.log('LoggingInUserId: ' + LoggingInUserId);

}

function not_loggedin() {
    console.log('ログインしていません');
    //open_login();
    xhr_get('/fullScPopup/login.html', (call) => {
        let main_container = document.getElementById('main_container');
        main_container.innerHTML = call;

        let scriptElms = main_container.querySelectorAll('script');
        for (let i = 0; i < scriptElms.length; i++) {
            let script = scriptElms[i].innerHTML;
            scriptElms[i].remove();
            console.log([i, script]);
            let loaded_script = document.createElement('script');
            loaded_script.innerHTML = script;
            main_container.appendChild(loaded_script);
        }
    });
}

function xhr_get(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callback(xhr.responseText);
        }
    }
    xhr.open('GET', url, true);
    xhr.send(null);
}


// ページを読み込ませる
function loadPage(page) {
    let pagetitle = document.getElementById('pagetitle');
    let content_box = document.getElementById('content_box');

    pagetitle.innerText = page.toUpperCase();
    content_box.innerHTML = `
    <span class="loadani_container">
        <span class="loadani_box">
            <span class="loadani loadani_tl"></span>
            <span class="loadani loadani_tr"></span>
            <span class="loadani loadani_br"></span>
            <span class="loadani loadani_bl"></span>
        </span>
        <span>
            Loading...
        </span>
    </span>`;

    console.log(`loading: ${page}`)
    document.title = `${page.toUpperCase()} | NotSNS`;
    eval(`load_${page}()`);
}

// ページ遷移前にURLハッシュを変えるとか
function changePage(pagetitle, check) {
    let setHash = '#' + pagetitle;
    if (location.hash != setHash || check == false) {
        history.pushState(null, null, setHash);
        //console.log(location.hash)
        loadPage(pagetitle);
    }
}

//戻ったり進んだりしたらページ変えるための
window.addEventListener('hashchange', function () {
    console.log(location.hash);
    loadPage(location.hash.substring(1));
});

function Post() {
    let postbutton = document.getElementById('post_button');
    postbutton.disabled = true;
    let postcontent = document.getElementById('postform_postcontent').innerText;
    let shaped_postcontent = postcontent.replace(/^(\s|\n)*/, '').replace(/(\s|\n)*$/, '');
    let postdate = getnowDate();

    let postid = getnowDate('str');

    let req = indexedDB.open(LoggingInUserId);
    req.onsuccess = function (e) {
        let db = e.target.result;
        let tx = db.transaction(['posts'], 'readwrite');
        let store = tx.objectStore('posts');
        let postdata = {
            postid: postid,
            postcontent: {
                text: shaped_postcontent,
            },
            postdate: postdate,
        }
        store.put(postdata);

        document.getElementById('postform_postcontent').innerHTML = '';
        formcheck();
        postbutton.disabled = false;

        db.close();
    }
    console.log(shaped_postcontent);
}