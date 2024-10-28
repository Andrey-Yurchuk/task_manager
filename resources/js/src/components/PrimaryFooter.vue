<template>
    <footer class="footer">
        <div class="footer__content">
            2024 г. Task Manager
        </div>
    </footer>
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
.footer {
    width: 992px;
    margin: 20px auto;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e0e0e0;
    border-top: 2px solid #ccc;
    font-family: 'Courier New', Courier, monospace;
    border-radius: 15px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.footer__content {
    color: #333;
    font-size: 1.2em;
}

@media (max-width: 1010px) {
    .footer {
        width: 792px;
    }
}

@media (max-width: 810px) {
    .footer {
        width: 590px;
    }
}

@media (max-width: 605px) {
    .footer {
        width: 405px;
    }
}
</style>
