<template>
    <div class="home">
        <h1>Добро пожаловать в Task Manager</h1>
        <p>Это приложение поможет вам организовать ваши задачи, следить за их статусом и эффективно управлять своим временем.</p>
        <div class="quick-links">
            <h3>Быстрые ссылки:</h3>
            <ul>
                <li><router-link to="/task-list">Посмотреть задачи</router-link></li>
                <li><router-link to="/about">О проекте</router-link></li>
            </ul>
        </div>
    </div>
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
.home {
    font-family: "Courier New", Courier, monospace;
    background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
    padding: 20px;
    max-width: 800px;
    margin: auto;
    border: 2px solid #333;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

    h1 {
        font-size: 2.5em;
        color: #4d4d4d;
        margin-bottom: 20px;
        text-align: center;
    }

    p {
        font-size: 1.1em;
        color: #555;
        margin-bottom: 20px;
    }

    .quick-links {
        margin-top: 20px;

        h3 {
            font-size: 1.5em;
            color: #333;
            text-decoration: underline;
        }

        ul {
            list-style: none;
            padding: 0;

            li {
                margin: 10px 0;
                a {
                    font-size: 1.2em;
                    color: #0066cc;
                    text-decoration: none;
                    &:hover {
                        text-decoration: underline;
                        color: #003366;
                    }
                }
            }
        }
    }
}
</style>
