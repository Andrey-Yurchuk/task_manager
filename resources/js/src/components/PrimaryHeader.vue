<template>
    <header class="header">
        <nav class="header__nav">
            <ul class="header__menu">
                <li class="nav-item">
                    <router-link class="nav-link" to="/">Главная</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/task-list">Задачи</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/about">О проекте</router-link>
                </li>
            </ul>
        </nav>
    </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        return {};
    },
});
</script>

<style lang="less" scoped>
.header {
    width: 992px;
    margin: 0 auto;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e0e0e0;
    border-bottom: 2px solid #ccc;
    font-family: 'Courier New', Courier, monospace;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header__nav {
    width: 100%;
    text-align: center;
}

.header__menu {
    list-style: none;
    padding: 0;
    margin: 0;
    display: inline-flex;
}

.nav-item {
    margin: 0 30px;
}

.nav-link {
    text-decoration: none;
    color: #333;
    font-size: 1.2em;
    padding: 10px 15px;
    border-radius: 5px;
    transition: background-color 0.3s, color 0.3s;
}

.nav-link:hover {
    background-color: #ff69b4;
    color: #fff;
}

@media (max-width: 1010px) {
    .header {
        width: 792px;
    }
}

@media (max-width: 810px) {
    .header {
        width: 590px;
        height: 70px;
    }
}

@media (max-width: 605px) {
    .header {
        width: 405px;
    }

    .nav-item {
        margin: 0 10px;
    }
}
</style>
