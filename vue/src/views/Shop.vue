<template>
    <div class="container">
        <h2>Магазин</h2>

        <!-- Форма добавления (Drag and Drop) -->
        <div class="add-form">
            <h3>Добавить блюдо (перетащите фото)</h3>
            <div class="drop-zone" @dragover.prevent @drop.prevent="handleDrop">
                Перетащите изображение сюда ({{ imageName || 'не выбрано' }})
            </div>
            <input v-model="newDish.name" placeholder="Название" />
            <input v-model="newDish.price" placeholder="Цена" type="number" />
            <input v-model="newDish.composition" placeholder="Состав" />
            <button @click="addDish">Добавить блюдо</button>
        </div>

        <hr>

        <!-- Список блюд (Аккордеон) -->
        <div v-for="dish in dishes" :key="dish.id" class="dish-card">
            <div class="dish-header" @click="toggleDish(dish.id)">
                <span>{{ dish.name }}</span>
                <span>{{ isOpen(dish.id) ? '▲' : '▼' }}</span>
            </div>

            <div v-if="isOpen(dish.id)" class="dish-body">
                <p><b>Состав:</b> {{ dish.composition }}</p>
                <p><b>Цена:</b> {{ dish.price }} руб.</p>
                <p><b>Время готовки:</b> {{ dish.cooking_time }}</p>
                <p><b>Способ:</b> {{ dish.method }}</p>

                <button @click="addToCart(dish.id)">В корзину</button>
                <button @click="deleteDish(dish.id)" style="background: red; color: white;">Удалить</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            dishes: [],
            openDishes: [],
            newDish: { name: '', price: '', composition: '', cooking_time: '30 мин', method: 'В духовке' },
            imageName: ''
        }
    },
    mounted() {
        this.fetchDishes();
    },
    methods: {
        async fetchDishes() {
            const res = await axios.get('http://localhost:3000/api/dishes');
            this.dishes = res.data;
        },
        toggleDish(id) {
            if (this.openDishes.includes(id)) {
                this.openDishes = this.openDishes.filter(d => d !== id);
            } else {
                this.openDishes.push(id);
            }
        },
        isOpen(id) {
            return this.openDishes.includes(id);
        },
        async addToCart(dishId) {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) return alert('Авторизуйтесь!');

            try {
                await axios.post('http://localhost:3000/api/cart', { userId: user.id, dishId });
                alert('Добавлено в корзину!');
            } catch (err) {
                alert(err.response?.data?.message || 'Ошибка');
            }
        },
        async deleteDish(id) {
            if (confirm('Удалить блюдо?')) {
                await axios.delete(`http://localhost:3000/api/dishes/${id}`);
                this.fetchDishes(); // Обновить список
            }
        },
        handleDrop(event) {
            const file = event.dataTransfer.files[0];
            if (file) this.imageName = file.name;
        },
        async addDish() {
            await axios.post('http://localhost:3000/api/dishes', this.newDish);
            alert('Блюдо добавлено!');
            this.newDish = { name: '', price: '', composition: '', cooking_time: '30 мин', method: 'В духовке' };
            this.fetchDishes();
        }
    }
}
</script>

<style scoped>
.container {
    max-width: 600px;
    margin: 0 auto;
}

.dish-card {
    border: 1px solid #ccc;
    margin-bottom: 10px;
    border-radius: 5px;
}

.dish-header {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: #f9f9f9;
    cursor: pointer;
}

.dish-body {
    padding: 10px;
}

.drop-zone {
    border: 2px dashed #ccc;
    padding: 20px;
    text-align: center;
    margin-bottom: 10px;
}

.add-form input {
    display: block;
    width: 100%;
    margin-bottom: 5px;
    padding: 5px;
}
</style>