<script setup>
import { ref, onMounted } from 'vue'
import HeroSection from "~/components/Main/HeroSection.vue";

// Данные, которые будем получать из API
const pageData = ref(null)
const heroData = ref({
  title: '',
  subtitle: '',
  backgroundImage: ''
})

// Функция для получения данных
const fetchPageData = async () => {
  try {
    // Замените URL на ваш реальный эндпоинт WordPress
    const response = await fetch('http://localhost:8000/wp-json/wp/v2/pages?slug=home&_fields=title,acf')

    if (!response.ok) {
      throw new Error('Ошибка при получении данных')
    }

    const data = await response.json()
    pageData.value = data[0] // Получаем первую страницу (если slug уникален)

    // Формируем данные для HeroSection
    if (pageData.value) {
      heroData.value = {
        title: pageData.value.title.rendered,
        subtitle: pageData.value.acf?.hero_subtitle || '',
        backgroundImage: pageData.value.acf?.hero_background_image?.url || ''
      }
    }
  } catch (error) {
    console.error('Ошибка:', error)
  }
}

onMounted(() => {
  fetchPageData()
})
</script>

<template>
  <main class="main-index">
    <HeroSection
        v-if="heroData.title"
        :title="heroData.title"
        :subtitle="heroData.subtitle"
        :background-image="heroData.backgroundImage"
    />
  </main>
</template>

<style scoped>
</style>