/* eslint-disable */
// @ts-nocheck
const request = require('request');

export class TokenVerifier {
    static async verifyFacebookToken(token: string): Promise<boolean> {
        const options = {
            'method': 'GET',
            'url': `https://graph.facebook.com/me?access_token=${token}`,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        };
        return new Promise(function (resolve, reject) {
            request(options, function (error, response) {
                // console.log(response.body);
                if (error) {
                    reject(false);
                }
                else {
                    const obj = JSON.parse(response.body)
                    if (obj?.id && obj?.name) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            })
        })

    }

    static async verifyGoogleToken(token: string): Promise<boolean> {
        const options = {
            'method': 'GET',
            'url': `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`,
        };

        return new Promise(function (resolve, reject) {
            request(options, function (error, response) {
                if (error) {
                    reject(false);
                }
                else {
                    // eslint-disable-next-line
                    const obj = JSON.parse(response.body)
                    if (obj?.email) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            })
        });
    }
}