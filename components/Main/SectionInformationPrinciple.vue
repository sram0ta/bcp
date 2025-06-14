<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import lottie from 'lottie-web'
import { WpApi } from '~/composables/WpApi'

const { fetchData } = WpApi()

interface PrincipleItem {
  icon: number
  title: string
  description: string
}

const principleTitle = ref('')
const principleDescription = ref('')
const principleList = ref<PrincipleItem[]>([])
const lottieRefs = ref<HTMLElement[]>([])

async function getMediaUrl(id: number): Promise<string | null> {
  try {
    const media = await fetchData(`media/${id}`, '?_fields=source_url')
    return media?.source_url ?? null
  } catch (e) {
    console.warn(`Не удалось получить media для ID ${id}:`, e)
    return null
  }
}

const buttonFormHref = ref<string>('#form')
const buttonFormTitle = ref<string>('Обсудить проект')
const buttonFormOption = ref<'bg-blur' | 'bg-white' | 'bg-red'>('bg-red')

onMounted(async () => {
  try {
    const response = await fetchData('pages/16', '?_fields=acf')

    if (response?.acf) {
      principleTitle.value = response.acf.principle__title ?? ''
      principleDescription.value = response.acf.principle__description ?? ''
      principleList.value = response.acf.repeater_principle ?? []

      const urls = await Promise.all(
          principleList.value.map(item => getMediaUrl(item.icon))
      )

      console.log(urls)
      await nextTick()

      lottieRefs.value.forEach((el, i) => {
        const url = urls[i]
        if (url && el) {
          lottie.loadAnimation({
            container: el,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: url,
          })
        }
      })
    } else {
      console.warn('Неполные данные:', response)
    }
  } catch (error) {
    console.error('Ошибка при загрузке:', error)
  }
})
</script>

<template>
  <div class="principle grid-12">
    <h2 class="principle__title h2">{{ principleTitle }}</h2>
    <p class="principle__description p2">{{ principleDescription }}</p>
    <div class="principle__list">
      <div
          class="principle__item"
          v-for="(item, index) in principleList"
          :key="index"
      >
        <div class="principle__item__inner">
          <div
              class="principle__item__icon"
              :ref="el => lottieRefs[index] = el as HTMLElement"
          ></div>
          <h3 class="principle__item__title h3">{{ item.title }}</h3>
        </div>
        <p class="principle__item__description p2">{{ item.description }}</p>
      </div>
    </div>
    <ui-button
        :href="buttonFormHref"
        :title="buttonFormTitle"
        :option="buttonFormOption"
    />
  </div>
</template>


<style scoped>

</style>