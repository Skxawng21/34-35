import { ref } from 'vue';

const user = ref(JSON.parse(localStorage.getItem('user')) || null);

export function useAuth() {
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    user.value = userData;
  };

  const logout = () => {
    localStorage.removeItem('user');
    user.value = null;
  };

  return { user, login, logout };
}