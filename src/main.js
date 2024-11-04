import '@/assets/css/main.css';
import '@/assets/css/bootstrap.min.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import SoftUIDashboard from './soft-ui-dashboard';
// 引入 vue3-perfect-scrollbar
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import 'vue3-perfect-scrollbar/style.css';
// 引入 vue-smooth-scroll
import vueSmoothScroll from 'vue-smooth-scroll';

// 引入 animate.css
import 'animate.css/animate.min.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(SoftUIDashboard);
app.use(ElementPlus);
app.component('EasyDataTable', Vue3EasyDataTable);
app.use(PerfectScrollbarPlugin);
app.use(vueSmoothScroll);
app.mount('#app');
