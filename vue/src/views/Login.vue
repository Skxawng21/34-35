<template>
    <div class="container">
        <h2>Вход</h2>
        <form @submit.prevent="loginUser">
            <input v-model="loginStr" placeholder="Логин" />
            <input v-model="password" type="password" placeholder="Пароль" />
            <button type="submit">Войти</button>
        </form>
        <p>Нет аккаунта? <router-link to="/register">Регистрация</router-link></p>
    </div>
</template>

<script>
import axios from 'axios';
import { useAuth } from '../auth.js';

export default {
    data() {
        return {
            loginStr: '', // Переименовал, чтобы не путать с функцией login
            password: ''
        }
    },
    methods: {
        async loginUser() {
            try {
                const res = await axios.post('http://localhost:3000/api/login', {
                    login: this.loginStr,
                    password: this.password
                });
                if (res.data.success) {
                    // Используем нашу реактивную функцию
                    const { login } = useAuth();
                    login(res.data.user);

                    this.$router.push('/menu');
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