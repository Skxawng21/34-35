<template>
  <div id="app">
    <nav>
      <!-- Теперь меню реагирует на изменения user -->
      <template v-if="user">
        <router-link to="/menu">Меню дня</router-link> |
        <router-link to="/shop">Магазин</router-link> |
        <router-link to="/cart">Корзина</router-link> |
        <router-link to="/search">Поиск</router-link> |
        <a href="#" @click.prevent="handleLogout">Выйти</a>
      </template>
      <template v-else>
        <router-link to="/login">Вход</router-link> |
        <router-link to="/register">Регистрация</router-link>
      </template>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from './auth.js';

const router = useRouter();
// Получаем реактивного пользователя и функцию выхода
const { user, logout } = useAuth();

const handleLogout = () => {
  logout(); // Очищаем состояние
  router.push('/login'); // Переходим на страницу входа
};
</script>

<style>
nav {
  text-align: center;
  padding: 20px;
  background: #f0f0f0;
  margin-bottom: 20px;
}

nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #333;
  font-weight: bold;
  cursor: pointer;
}
</style>