<template>
    <div class="container">
        <h2>Поиск</h2>
        <input v-model="query" placeholder="Название блюда" />
        <button @click="search">Найти</button>

        <div v-if="results.length > 0" class="results">
            <div v-for="dish in results" :key="dish.id" class="result-item">
                <h4>{{ dish.name }}</h4>
                <p>{{ dish.price }} руб.</p>
            </div>
        </div>
        <div v-else-if="searched">Ничего не найдено</div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            query: '',
            results: [],
            searched: false
        }
    },
    methods: {
        async search() {
            const res = await axios.get(`http://localhost:3000/api/search?query=${this.query}`);
            this.results = res.data;
            this.searched = true;
        }
    }
}
</script>

<style scoped>
.result-item {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
}
</style>