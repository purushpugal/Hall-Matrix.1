const http = require('http');

const collegeCode = 'TESTCOL' + Math.floor(Math.random() * 10000);
const email = `test_${Math.floor(Math.random() * 100000)}@college.edu`;
const password = 'password123';

const registerData = JSON.stringify({
  college_name: 'Test College Name',
  college_code: collegeCode,
  contact_person: 'Test Admin Person',
  contact_number: '9876543210',
  email: email,
  password: password,
  password_confirmation: password
});

const loginData = JSON.stringify({
  email: email,
  password: password
});

function postJSON(path, data, callback) {
  const req = http.request({
    hostname: 'localhost',
    port: 8000,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  }, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      callback(res.statusCode, body);
    });
  });
  
  req.on('error', (err) => {
    console.error(`Request to ${path} failed:`, err);
  });
  
  req.write(data);
  req.end();
}

console.log('Registering college with email:', email);
postJSON('/api/colleges', registerData, (status, body) => {
  console.log('Registration Status Code:', status);
  console.log('Registration Response Body:', body);
  
  if (status === 201 || status === 200) {
    console.log('\nAttempting login with email:', email);
    postJSON('/api/auth/login', loginData, (lStatus, lBody) => {
      console.log('Login Status Code:', lStatus);
      console.log('Login Response Body:', lBody);
    });
  }
});
