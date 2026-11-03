<template>
    <div class="container">
        <h2>Меню дня</h2>
        <p>Акции: Скидка 10% на выпечку!</p>
        <p>Новинка: Хлеб с семечками!</p>
        <button @click="$router.push('/shop')">Перейти в Магазин</button>
    </div>
</template>

<style scoped>
.container {
    text-align: center;
    margin-top: 50px;
}

button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}
</style>