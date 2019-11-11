const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const ejs = require('ejs');
const path = require('path');
const port = process.env.PORT || 3000;

var router = express.Router();
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: 'ambc@!vsmkv#!&*!#EDNAnsv#!$()_*#@',
    resave: false,
    saveUninitialized: true
}));

const users = [
    {
        user_id: 'hyeok',
        user_nickname: '혁',
        user_pwd: '123456'
    },
    {
        user_id: 'hyc7575',
        user_nickname: '에이치',
        user_pwd: '1q2w3e4r'
    }
]


const findUser = (user_id, user_pwd) => {
    // id와 password가 일치하는 유저 찾는 함수, 없으면 undefined 반환
    return users.find( v => (v.user_id === user_id && v.user_pwd === user_pwd) );
}
const findUserIndex = (user_id, user_pwd) => {
    // 일치하는 유저의 index값(유니크) 반환
    return users.findIndex( v => (v.user_id === user_id && v.user_pwd === user_pwd) );
}

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/html');
//   res.end('<h1>Hello World</h1>');
// });

// app.get('/', (req, res) =>{
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/html');
//     res.end('<h1>Hello World</h1>');
// })

app.get('/', (req, res) => {
    const sess = req.session; // 세션 객체에 접근
    res.render('view', {
        nickname: sess.user_uid+1 ? users[sess.user_uid]['user_nickname'] : ''
    });
});

app.get('/login', (req, res) => {
    res.render('login'); // login.ejs 랜더링
});
app.post('/login', (req, res) => {
    const body = req.body; // body-parser 사용
    if( findUser( body.user_id, body.user_pwd ) ) {
    // 해당유저가 존재한다면
        req.session.user_uid = findUserIndex( body.user_id, body.user_pwd ); //유니크한 값 유저 색인 값 저장
        res.redirect('/');
    } else {
        res.send('유효하지 않습니다.');
    }
});

app.get('/logout', (req, res) => {
    delete req.session.user_uid;
    res.redirect('/');
});

app.get('/join', (req, res) => {
    res.render('join');
});
app.post('/join', (req, res) => {
    const body = req.body;
    if( !findUser(body.user_id, body.user_pwd) ) {
        // 아이디도 중복안되게 분기 해야는데 예제이므로..
        users.push({
            user_id: body.user_id,
            user_pwd: body.user_pwd,
            user_nickname: body.user_nickname
        });
        res.redirect('/login');
    } else {
        res.send('이미 존재함');
    }
});

app.listen(port,() => {
  console.log(`Server running at port `+port);
});