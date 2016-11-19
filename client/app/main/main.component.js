import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {

  awesomeThings = [];
  markovObjects= [{handle:'@jordan', tweets:["Hello,","world!"]}];
  newThing = '';
  counter = 10;

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    this.$http.get('/api/things')
      .then(response => {
        this.awesomeThings = response.data;
      });
  }

  addMarkovObject() {
    this.markovObjects.push({
      handle: '',
      tweets: []
    })
  }

  generateTweet(markov) {
    //TODO: ADD LOGIC TO CALL ENDPOINT AND GET TWEEt
    markov.tweets.push(this.counter + ' ');
    this.counter = this.counter + 1;
  }

  addThing() {
    if(this.newThing) {
      //please
      this.$http.post('/api/things', {
        name: this.newThing
      });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete(`/api/things/${thing._id}`);
  }
}

export default angular.module('doppelApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
