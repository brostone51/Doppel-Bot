import angular from 'angular';
import uiRouter from 'angular-ui-router';
import MyMarkov from 'libmarkov';
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
      saved: false,
      markoved: false
    })
  }

  generateTweet(markovObj) {
    if (!markovObj.markoved) {
      this.$http.get(`/api/user-tweets/${markovObj.handle}`)
        .then(response => {
          markovObj.markoved = true;
          let data = response.data;
          console.log(response.data);
          let text = data.tweets.map(function(elem) {
            return elem.status;
          }).join('\n');
          console.log(text);
          //let text = data.tweets.join('\n');
          text = text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
          text = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
          text = text.replace(/\s{2,}/g," ");
          markovObj.generator = new MyMarkov(text);
          markovObj.tweets.push(markovObj.generator.generate(1));
        })
    } else {
      markovObj.tweets.push(markovObj.generator.generate(1));
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
