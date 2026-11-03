<template>
    <div class="container">
        <h2>Регистрация</h2>
        <form @submit.prevent="register">
            <div :class="{ error: errors.login }">
                <input v-model="login" placeholder="Логин" />
                <span v-if="errors.login">{{ errors.login }}</span>
            </div>
            <div :class="{ error: errors.password }">
                <input v-model="password" type="password" placeholder="Пароль" />
                <span v-if="errors.password">{{ errors.password }}</span>
            </div>
            <button type="submit">Зарегистрироваться</button>
        </form>
        <p>Уже есть аккаунт? <router-link to="/login">Войти</router-link></p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            login: '',
            password: '',
            errors: {}
        }
    },
    methods: {
        async register() {
            // Валидация
            this.errors = {};
            if (!this.login) this.errors.login = 'Введите логин';
            if (!this.password || this.password.length < 4) this.errors.password = 'Пароль должен быть > 4 символов';

            if (Object.keys(this.errors).length > 0) return;

            try {
                const res = await axios.post('http://localhost:3000/api/register', {
                    login: this.login,
                    password: this.password
                });
                if (res.data.success) {
                    alert('Успешно! Теперь войдите.');
                    this.$router.push('/login'); // Переход на вход
                }
            } catch (err) {
                alert(err.response?.data?.message || 'Ошибка регистрации');
            }
        }
    }
}
</script>

<style scoped>
.container {
    max-width: 300px;
    margin: 50px auto;
    text-align: center;
}

input {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    padding: 8px;
    box-sizing: border-box;
}

.error input {
    border: 2px solid red;
}

.error span {
    color: red;
    font-size: 12px;
    display: block;
    text-align: left;
    margin-bottom: 10px;
}

button {
    width: 100%;
    padding: 10px;
    cursor: pointer;
}
</style>