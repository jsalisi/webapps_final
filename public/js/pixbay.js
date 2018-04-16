// pixbay.js.js
//
// Gets a gallery of images from an input on the main page
//
// Author: Justin Salisi
// ID:     A00937043
// Set:    2A

const request = require('request');

var api_key = '7246674-b37ac3e55b379cef1f626bb09';

var getImages = (image_search) => {
    return new Promise((resolve, reject) => {
        request({
            url: `https://pixabay.com/api/?key=${api_key}&q${encodeURIComponent(image_search)}&image_type=photo`,
            json: true
        }, (error, response, body) => {
            if (error) {
                reject('Error connecting to Pixbay API');
            } else if (body.code === 400) {
                reject("BLEEP BLOOP: website not found");
            } else {
                resolve({
                    img_url1: body.hits[0].userImageURL,
                    img_url2: body.hits[1].userImageURL
                });
            };
        })
    });
}

module.exports = {
    getImages
}