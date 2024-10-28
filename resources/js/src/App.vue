<template>
    <PrimaryHeader />
    <main class="main">
        <router-view />
    </main>
    <PrimaryFooter/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PrimaryHeader from './components/PrimaryHeader.vue';
import PrimaryFooter from "./components/PrimaryFooter.vue";

export default defineComponent({
    components: {
        PrimaryFooter,
        PrimaryHeader,
    },
    setup() {
        return {};
    },
});
</script>

<style lang="less" scoped>
.main {
    width: 992px;
    margin: 0 auto;
    padding-top: 20px;
}

@media (max-width: 1010px) {
    .main {
        width: 792px;
    }
}

@media (max-width: 810px) {
    .main {
        width: 590px;
    }
}

@media (max-width: 605px) {
    .main {
        width: 405px;
    }
}
</style>
