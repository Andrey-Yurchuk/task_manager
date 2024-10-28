<template>
    <div class="task-list">
        <h1>Список задач</h1>

        <!-- Форма для добавления новой задачи -->
        <form @submit.prevent="addTask" class="task-form">
            <input v-model="newTask.title" placeholder="Название задачи" required class="input-field" />
            <textarea v-model="newTask.description" placeholder="Описание задачи" class="textarea-field"></textarea>
            <select v-model="newTask.status" class="select-field">
                <option value="pending">В ожидании</option>
                <option value="in_progress">В процессе</option>
                <option value="completed">Завершено</option>
            </select>
            <button type="submit" class="submit-button">Добавить задачу</button>
        </form>

        <!-- Список задач с учетом пагинации -->
        <ul class="task-list-items">
            <li v-for="task in paginatedTasks" :key="task?.id" class="task-item">
                <h3>{{ task?.title }}</h3>
                <p>{{ task?.description }}</p>
                <p class="task-status">Статус: {{ formatStatus(task?.status) }}</p>
                <div class="task-buttons">
                    <button @click="openEditModal(task)" class="edit-button">Редактировать</button>
                    <button @click="deleteTask(task.id)" class="delete-button">Удалить</button>
                </div>
            </li>
        </ul>

        <!-- Элементы управления пагинацией -->
        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">Предыдущая</button>
            <span>Страница {{ currentPage }} из {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">Следующая</button>
        </div>

        <!-- Модальное окно для редактирования задачи -->
        <div v-if="editingTask" class="modal-overlay" @click.self="cancelEdit">
            <div class="modal-content" @click.stop>
                <h2>Редактировать задачу</h2>
                <input v-model="editingTask.title" placeholder="Название задачи" required class="input-field" />
                <textarea v-model="editingTask.description" placeholder="Описание задачи" class="textarea-field"></textarea>
                <select v-model="editingTask.status" class="select-field">
                    <option value="pending">В ожидании</option>
                    <option value="in_progress">В процессе</option>
                    <option value="completed">Завершено</option>
                </select>
                <div class="edit-buttons">
                    <button @click="updateTask" class="save-button">Сохранить изменения</button>
                    <button @click="cancelEdit" class="cancel-button">Отменить</button>
                </div>
            </div>
        </div>

        <!-- Всплывающее сообщение -->
        <div v-if="notification.visible" class="notification" :class="notification.type">
            {{ notification.message }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

interface Task {
    id?: number;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
}

interface Notification {
    message: string;
    type: string; // 'success' | 'error'
    visible: boolean;
}

export default defineComponent({
    setup() {
        const tasks = ref<Task[]>([]);
        const newTask = ref<Task>({ title: '', description: '', status: 'pending' });
        const editingTask = ref<Task | null>(null);
        const notification = ref<Notification>({ message: '', type: '', visible: false });

        // Получение CSRF-токена
        const getCsrfToken = () => {
            const csrfToken = document.querySelector('meta[name="csrf-token"]');
            return csrfToken ? csrfToken.getAttribute('content') : '';
        };

        // Параметры пагинации
        const tasksPerPage = 3;
        const currentPage = ref(1);

        // Функция для получения списка задач
        const fetchTasks = async () => {
            try {
                const response = await fetch('/api/tasks', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                });
                if (!response.ok) throw new Error('Ошибка сети');
                tasks.value = await response.json();
            } catch (error) {
                console.error("Ошибка при получении задач:", error.message);
            }
        };

        const paginatedTasks = computed(() => {
            const start = (currentPage.value - 1) * tasksPerPage;
            return tasks.value.slice(start, start + tasksPerPage);
        });

        const totalPages = computed(() => Math.ceil(tasks.value.length / tasksPerPage));

        // Функция для перехода на следующую страницу в системе пагинации
        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++;
            }
        };

        // Функция для перехода на предыдущую страницу в системе пагинации
        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--;
            }
        };

        // Функция для добавления новой задачи
        const addTask = async () => {
            try {
                const csrfToken = getCsrfToken();
                const response = await fetch('/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify(newTask.value),
                });
                if (!response.ok) throw new Error('Ошибка при добавлении задачи');
                newTask.value = { title: '', description: '', status: 'pending' };
                fetchTasks();
                showNotification('Задача успешно добавлена!', 'success');
            } catch (error) {
                console.error("Ошибка при добавлении задачи:", error);
                showNotification('Ошибка при добавлении задачи', 'error');
            }
        };

        // Функция для открытия модального окна редактирования
        const openEditModal = (task: Task) => {
            editingTask.value = { ...task };
        };

        // Функция для обновления задачи
        const updateTask = async () => {
            try {
                const csrfToken = getCsrfToken();
                const response = await fetch(`/api/tasks/${editingTask.value.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify(editingTask.value),
                });
                if (!response.ok) throw new Error('Ошибка при обновлении задачи');
                editingTask.value = null;
                fetchTasks();
                showNotification('Задача успешно обновлена!', 'success');
            } catch (error) {
                console.error("Ошибка при обновлении задачи:", error);
                showNotification('Ошибка при обновлении задачи', 'error');
            }
        };

        // Функция для отмены редактирования
        const cancelEdit = () => {
            editingTask.value = null;
        };

        // Функция для удаления задачи
        const deleteTask = async (taskId: number) => {
            try {
                const csrfToken = getCsrfToken();
                const response = await fetch(`/api/tasks/${taskId}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': csrfToken
                    },
                });
                if (!response.ok) throw new Error('Ошибка при удалении задачи');
                fetchTasks();
                showNotification('Задача успешно удалена!', 'success');
            } catch (error) {
                console.error("Ошибка при удалении задачи:", error);
                showNotification('Ошибка при удалении задачи', 'error');
            }
        };

        // Функция для форматирования статуса
        const formatStatus = (status: string) => {
            switch (status) {
                case 'pending':
                    return 'В ожидании';
                case 'in_progress':
                    return 'В процессе';
                case 'completed':
                    return 'Завершено';
                default:
                    return status;
            }
        };

        // Функция для показа уведомления
        const showNotification = (message: string, type: string) => {
            notification.value = { message, type, visible: true };
            setTimeout(() => {
                notification.value.visible = false;
            }, 3000);
        };

        fetchTasks();

        return {
            tasks,
            newTask,
            addTask,
            editingTask,
            openEditModal,
            updateTask,
            cancelEdit,
            deleteTask,
            formatStatus,
            notification,
            paginatedTasks,
            currentPage,
            totalPages,
            nextPage,
            prevPage,
        };
    },
});
</script>

<style lang="less" scoped>
.task-list {
    font-family: "Courier New", Courier, monospace;
    max-width: 800px;
    margin: auto;
    background-color: #fcfcf0;
    padding: 20px;
    border: 1px solid #333;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

    h1 {
        font-size: 2em;
        color: #333;
        text-align: center;
        margin-bottom: 20px;
    }

    .task-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20px;
    }

    .input-field,
    .textarea-field,
    .select-field {
        width: 100%;
        padding: 10px;
        margin: 5px 0;
        border: 1px solid #333;
        border-radius: 4px;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
        font-family: "Courier New", Courier, monospace;
        font-size: 1em;
        transition: border-color 0.2s;

        &:focus {
            border-color: #4CAF50;
            outline: none;
        }
    }

    .textarea-field {
        height: 100px;
        resize: vertical;
    }

    .submit-button {
        background-color: #4CAF50;
        color: white;
        margin-top: 10px;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1em;
        transition: background-color 0.2s;
        width: 35%;
        text-align: center;

        &:hover {
            background-color: #45a049;
        }
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 100%;

        h2 {
            margin-top: 0;
        }

        .edit-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;

            .save-button {
                background-color: #28a745;
                color: white;
                padding: 10px 15px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                flex: 1;
                font-size: 0.9em;
                margin-right: 10px;
                transition: background-color 0.2s;

                &:hover {
                    background-color: #218838;
                }
            }

            .cancel-button {
                background-color: #dc3545;
                color: white;
                padding: 10px 15px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                flex: 1;
                font-size: 0.9em;
                transition: background-color 0.2s;

                &:hover {
                    background-color: #c82333;
                }
            }
        }
    }

    .task-list-items {
        list-style-type: none;
        padding: 0;

        .task-item {
            background-color: #fff;
            margin: 10px 0;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .task-status {
            font-weight: bold;
        }

        .edit-button,
        .delete-button {
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 10px;
            transition: background-color 0.2s;
            font-size: 1em;

            &.edit-button {
                background-color: #007bff;
                color: white;

                &:hover {
                    background-color: #0056b3;
                }
            }

            &.delete-button {
                background-color: #dc3545;
                color: white;

                &:hover {
                    background-color: #c82333;
                }
            }
        }
    }

    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 999;

        &.success {
            background-color: #4caf50;
        }

        &.error {
            background-color: #f44336;
        }
    }

    .pagination {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .pagination button {
        margin: 0 20px;
        padding: 5px 10px;
        border: 1px solid #8B8B8B;
        border-radius: 4px;
        background-color: #f0f0f0;
        color: #000;
        font-family: 'Courier New', Courier, monospace;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.3s, border-color 0.3s;
    }

    .pagination button:hover {
        background-color: #d0d0d0;
        border-color: #555;
    }

    .pagination .active {
        background-color: #8B0000;
        color: #fff;
        border-color: #800000;
    }

    .pagination .disabled {
        background-color: #e0e0e0;
        color: #a0a0a0;
        cursor: not-allowed;
    }
}

@media (max-width: 1010px) {
    .task-list {
        max-width: 620px;
    }
}

@media (max-width: 810px) {
    .task-list {
        max-width: 435px;
    }
}

@media (max-width: 605px) {
    .task-list {
        max-width: 325px;

        .submit-button {
            padding: 5px 10px;
            font-size: 0.9em;
        }

        .edit-button {
            margin-bottom: 10px;
        }

        .pagination button {
            margin: 0 7px;
        }
    }
}
</style>
