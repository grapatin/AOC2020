const axios = require('axios');
const configuration = require('./cookie.json')

//import axios, { AxiosRequestConfig, AxiosPromise } from 'axios'

var config = {
    method: 'get',
    url: 'https://adventofcode.com/2020/leaderboard/private/view/663039.json',
    headers: {
        'Cookie': configuration.cookie
    }
};

class Member {
    _name: string;
    _score: number;
    //_dayArray: Array<Array<number>>;

    constructor(member: any) {
        this._name = member.name;
        this._score = member.local_score

        for (let date in member.completion_day_level) {
            for (let part in member.completion_day_level[date]) {
                let timestamp = +member.completion_day_level[date][part].get_star_ts;
                let dateTime = new Date(timestamp * 1000);
                console.log('Name:', this._name, 'Day', date, 'part', part, 'Time:', dateTime);
                //console.log('Name:', this._name, 'Day', date, 'part', part);
            }
        }

    }
}


async function load() {

    await axios(config)
        .then((response: any) => {
            console.log(JSON.stringify(response.data));
            let replyData = response.data;
            let members = replyData.members;
            let memberArray: Array<Member> = new Array();
            let i;
            for (i in members) {
                memberArray.push(new Member(members[i]));
            }
        })
        .catch((error: any) => {
            console.log(error);
        });
}


load();
