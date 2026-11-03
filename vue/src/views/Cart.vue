<template>
    <div class="container">
        <h2>Корзина</h2>
        <div v-if="cart.length === 0">Корзина пуста</div>

        <div v-for="item in cart" :key="item.cart_id" class="cart-item">
            <span>{{ item.name }}</span>
            <span>{{ item.price }} руб. x {{ item.quantity }}</span>

            <div>
                <button @click="updateQty(item.cart_id, item.quantity - 1)">-</button>
                <button @click="updateQty(item.cart_id, item.quantity + 1)">+</button>
            </div>
        </div>

        <button v-if="cart.length > 0" @click="order" class="order-btn">Заказать</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            cart: []
        }
    },
    mounted() {
        this.fetchCart();
    },
    methods: {
        async fetchCart() {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) return this.$router.push('/login');

            const res = await axios.get(`http://localhost:3000/api/cart/${user.id}`);
            this.cart = res.data;
        },
        async updateQty(cartId, newQty) {
            if (newQty < 1) {
                if (confirm('Удалить блюдо?')) {
                    await axios.put(`http://localhost:3000/api/cart/${cartId}`, { quantity: 0 });
                    this.fetchCart();
                }
                return;
            }
            if (newQty > 3) {
                alert('Блюдо закончилось (макс. 3)');
                return;
            }

            await axios.put(`http://localhost:3000/api/cart/${cartId}`, { quantity: newQty });
            this.fetchCart();
        },
        async order() {
            const user = JSON.parse(localStorage.getItem('user'));
            if (confirm('Подтвердить заказ?')) {
                await axios.post('http://localhost:3000/api/order', { userId: user.id });
                alert('Заказ оформлен!');
                this.fetchCart();
            }
        }
    }
}
</script>

<style scoped>
.cart-item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #eee;
}

.order-btn {
    width: 100%;
    padding: 15px;
    background: green;
    color: white;
    margin-top: 20px;
    font-size: 16px;
    cursor: pointer;
}
</style>