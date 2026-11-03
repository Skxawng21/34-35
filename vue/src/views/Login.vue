<template>
    <div class="container">
        <h2>Вход</h2>
        <form @submit.prevent="loginUser">
            <input v-model="login" placeholder="Логин" />
            <input v-model="password" type="password" placeholder="Пароль" />
            <button type="submit">Войти</button>
        </form>
        <p>Нет аккаунта? <router-link to="/register">Регистрация</router-link></p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            login: '',
            password: ''
        }
    },
    methods: {
        async loginUser() {
            try {
                const res = await axios.post('http://localhost:3000/api/login', {
                    login: this.login,
                    password: this.password
                });
                if (res.data.success) {
                    // Сохраняем пользователя в localStorage для доступа на других страницах
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    this.$router.push('/menu'); // Переход на меню дня
                }
            } catch (err) {
                alert('Неверный логин или пароль');
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

button {
    width: 100%;
    padding: 10px;
    cursor: pointer;
}
</style>