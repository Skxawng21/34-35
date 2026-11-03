<template>
  <div id="app">
    <nav v-if="isAuth">
      <router-link to="/menu">Меню дня</router-link> |
      <router-link to="/shop">Магазин</router-link> |
      <router-link to="/cart">Корзина</router-link> |
      <router-link to="/search">Поиск</router-link> |
      <a href="#" @click.prevent="logout">Выйти</a>
    </nav>
    <nav v-else>
      <router-link to="/login">Вход</router-link> |
      <router-link to="/register">Регистрация</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  computed: {
    isAuth() {
      return !!localStorage.getItem('user');
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('user');
      this.$router.push('/login');
      // Перезагрузка страницы, чтобы обновить навигацию
      window.location.reload();
    }
  }
}
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
}
</style>