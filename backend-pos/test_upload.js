const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testUpload() {
    try {
        console.log('Logging in...');
        const loginRes = await axios.post('https://kiru-navy.vercel.app/api/login', {
            email: 'admin@gmail.com',
            password: 'password'
        });
        const token = loginRes.data.data.token;
        console.log('Logged in. Token:', token.substring(0, 10) + '...');

        console.log('Creating dummy image...');
        const imgPath = path.join(__dirname, 'dummy.png');
        // create a dummy 1x1 png
        const dummyPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
        fs.writeFileSync(imgPath, dummyPng);

        console.log('Uploading category...');
        const form = new FormData();
        form.append('name', 'Test Category Vercel');
        form.append('description', 'Testing cloudinary upload');
        form.append('image', fs.createReadStream(imgPath));

        const uploadRes = await axios.post('https://kiru-navy.vercel.app/api/categories', form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Upload Success:', uploadRes.data);
    } catch (e) {
        console.error('Upload Error:');
        if (e.response) {
            console.error(e.response.status, JSON.stringify(e.response.data, null, 2));
        } else {
            console.error(e.message);
        }
    }
}

testUpload();
