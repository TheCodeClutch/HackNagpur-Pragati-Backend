const request = require('request');

module.exports.message = async (number, message) => {
    const options = {
        'method': 'POST',
        'url': 'https://rest-api.d7networks.com/secure/send',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ZnJzczQ4NTk6aFJPMEFONHM='
        },
        body: JSON.stringify(
            {
                "to": `${number}`,
                "content": `${message}`,
                "from":"SMSINFO",
                "dlr":"yes",
                "dlr-method":"GET",
                "dlr-level":"2",
                "dlr-url":"http://yourcustompostbackurl.com"
            }
        )
    };

    new Promise((resolve, reject) => {
        // resolve('Hello world')
        request(options, function (error, response) {
            if(error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    })
}
