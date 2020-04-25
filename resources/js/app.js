
require('./bootstrap');
require('admin-lte');

window.Vue = require('vue');
import { Form, HasError, AlertError } from 'vform';
import moment from 'moment';
import VueProgressBar from 'vue-progressbar';
import Swal from 'sweetalert2';
import Gate from './Gate';
Vue.prototype.$gate = new Gate(window.user);
Vue.component('pagination', require('laravel-vue-pagination'));

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})
window.Toast = Toast;
window.Swal = Swal;

window.Form = Form;
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

import VueRouter from 'vue-router'
Vue.use(VueRouter)

Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: 'red',
  height: '2px'
})

window.Fire = new Vue;

let routes = [
    { path: '/dashboard', component: require('./components/Dashboard.vue').default },
    { path: '/developer', component: require('./components/Developer.vue').default },
    { path: '/profile', component: require('./components/Profile.vue').default },
    { path: '/users', component: require('./components/Users.vue').default },
    { path: '*', component: require('./components/NotFound.vue').default }
  ]

const router = new VueRouter({
    mode: 'history',
    routes
}) 

Vue.filter('upText', function(text){
  return text.charAt(0).toUpperCase() + text.slice(1)
});

Vue.filter('myDate', function(created){
  return moment(created).format('MMMM Do YYYY, h:mm:ss a')
});

Vue.component(
  'passport-clients',
  require('./components/passport/Clients.vue').default
);

Vue.component(
  'passport-authorized-clients',
  require('./components/passport/AuthorizedClients.vue').default
);

Vue.component(
  'passport-personal-access-tokens',
  require('./components/passport/PersonalAccessTokens.vue').default
);

const app = new Vue({
    el: '#app',
    router,
    data: {
      search: ''
    },
    methods: {
      searchUser: _.debounce(()=>{
        Fire.$emit('Searching');
      },1000)
    }
});
