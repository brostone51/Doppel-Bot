import angular from 'angular';
import uiRouter from 'angular-ui-router';
import Markov from 'libmarkov';
import routing from './main.routes';

export class MainController {
  markovObjects= [];

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  saveHandle(markovObj) {
    markovObj.saved = true;
    this.$http.post('/api/user-tweets', {
      _id: markovObj.handle
    }).then(response => {
      //console.log(response); // todo: remove
      })
  }

  addMarkovObject() {
    this.markovObjects.push({
      handle: '',
      tweets: [],
      saved: false
    })
  }

  generateTweet(markovObj) {
    if (markovObj.handle) {
      this.$http.get(`/api/user-tweets/${markovObj.handle}`)
        .then(response => {
          let data = response.data;
          console.log(response.data);
          let text = data.tweets.join('\n');
          console.log(text);
          let generator = new Markov(text);
          markovObj.tweets.push(generator.generate(1));
        })
    } else {
      alert('Enter a twitter handle first')
    }
  }
}

export default angular.module('doppelApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
