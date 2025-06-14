<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { WpApi } from '~/composables/WpApi'

const { fetchData } = WpApi()

interface DirectionItem {
  sub_title: string
  title: string
}

const directionTitle = ref('')
const directionList = ref<DirectionItem[]>([])



onMounted(async () => {
  try {
    const response = await fetchData('pages/16', '?_fields=acf')

    console.log(response)

    if (response?.acf) {

      directionTitle.value = response.acf.direction_title ?? ''
      directionList.value = response.acf.repeater_direction ?? []

    } else {
      console.warn('Неполные данные:', response)
    }
  } catch (error) {
    console.error('Ошибка при загрузке:', error)
  }
})
</script>

<template>
  <div class="direction">
    <h2 class="direction__title h2">{{ directionTitle }} ({{ directionList.length }})</h2>
    <div class="direction__list">
      <div
          class="direction__item"
          v-for="(item, index) in directionList" :key="index"
      >
        <div class="direction__item__sub-title p2">{{ item.sub_title }}</div>
        <h3 class="direction__item__title h3">{{ item.title }}</h3>
      </div>
    </div>
  </div>
</template>


<style scoped>

</style>