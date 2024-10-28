<template>
    <div class="about">
        <h1>О проекте</h1>
        <p>
            Task Manager — это простой и удобный инструмент для управления задачами. Он был разработан с целью
            помочь пользователям организовать свое время и отслеживать прогресс выполнения различных задач.
        </p>
        <h2>Функциональные возможности:</h2>
        <ul>
            <li>Создание, редактирование и удаление задач</li>
            <li>Изменение статусов задач ("В ожидании", "В процессе" и "Выполнена")</li>
            <li>Просмотр списка всех задач</li>
        </ul>
        <h3>О разработчике</h3>
        <p>Этот проект создан в качестве учебного, но его можно легко адаптировать для реального использования.
            Разработчик — Андрей Юрчук.</p>
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
.about {
    font-family: "Courier New", Courier, monospace;
    max-width: 800px;
    margin: auto;
    padding: 20px;
    border: 2px solid #333;
    background: #fafafa;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

    h1, h2, h3 {
        color: #333;
        text-align: center;
    }

    p, ul {
        font-size: 1.1em;
        color: #444;
        line-height: 1.6;
    }

    ul {
        list-style-type: disc;
        margin-left: 20px;
    }
}
</style>
