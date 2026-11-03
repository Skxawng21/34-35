<template>
    <div class="container">
        <h2>Магазин</h2>

        <!-- Форма добавления (Видна ТОЛЬКО администратору) -->
        <div v-if="isAdmin" class="add-form">
            <h3>Добавить блюдо (Только для админа)</h3>
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

                <!-- Кнопка "В корзину" доступна всем авторизованным -->
                <button @click="addToCart(dish.id)" class="btn-cart">В корзину</button>

                <!-- Кнопка "Удалить" доступна ТОЛЬКО админу -->
                <button v-if="isAdmin" @click="deleteDish(dish.id)" class="btn-delete">
                    Удалить
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { useAuth } from '../auth.js';

export default {
    data() {
        return {
            dishes: [],
            openDishes: [],
            newDish: { name: '', price: '', composition: '', cooking_time: '30 мин', method: 'В духовке' },
            imageName: ''
        }
    },
    setup() {
        // Получаем реактивного пользователя
        const { user } = useAuth();
        return { user };
    },
    computed: {
        isAdmin() {
            // Проверяем роль через реактивного пользователя
            return this.user && this.user.role === 'admin';
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
            if (!this.user) return alert('Авторизуйтесь!');

            try {
                // Используем this.user.id
                await axios.post('http://localhost:3000/api/cart', { userId: this.user.id, dishId });
                alert('Добавлено в корзину!');
            } catch (err) {
                alert(err.response?.data?.message || 'Ошибка');
            }
        },
        async deleteDish(id) {
            if (!this.user) return;

            if (confirm('Удалить блюдо?')) {
                try {
                    // Передаем ID пользователя на сервер
                    await axios.delete(`http://localhost:3000/api/dishes/${id}/${this.user.id}`);
                    this.fetchDishes();
                } catch (err) {
                    alert(err.response?.data?.message || 'Ошибка удаления');
                }
            }
        },
        handleDrop(event) {
            const file = event.dataTransfer.files[0];
            if (file) this.imageName = file.name;
        },
        async addDish() {
            if (!this.user) return;

            try {
                await axios.post('http://localhost:3000/api/dishes', {
                    ...this.newDish,
                    userId: this.user.id
                });
                alert('Блюдо добавлено!');
                this.newDish = { name: '', price: '', composition: '', cooking_time: '30 мин', method: 'В духовке' };
                this.imageName = '';
                this.fetchDishes();
            } catch (err) {
                alert(err.response?.data?.message || 'Ошибка добавления');
            }
        }
    }
}
</script>

<style scoped>
.container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
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
    border: 2px dashed #4CAF50;
    padding: 20px;
    text-align: center;
    margin-bottom: 10px;
    background: #e8f5e9;
    cursor: pointer;
}

.add-form input {
    display: block;
    width: 100%;
    margin-bottom: 5px;
    padding: 8px;
    box-sizing: border-box;
}

.btn-cart {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 8px 15px;
    cursor: pointer;
    margin-right: 10px;
}

.btn-delete {
    background: #f44336;
    color: white;
    border: none;
    padding: 8px 15px;
    cursor: pointer;
}
</style>