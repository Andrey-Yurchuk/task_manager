import Home from '@/pages/Home.vue';
import TaskList from '@/pages/TaskList.vue';
import About from '@/pages/About.vue';

const routes = [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/task-list',
        component: TaskList,
    },
    {
        path: '/about',
        component: About,
    },
];

export default routes;
