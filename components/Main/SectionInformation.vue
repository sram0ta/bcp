<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import lottie from 'lottie-web'
import { WpApi } from '~/composables/WpApi'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger);

const { fetchData } = WpApi()

// --- Интерфейсы ---
interface PrincipleItem {
  icon: number
  title: string
  description: string
}

interface DirectionItem {
  sub_title: string
  title: string
}

interface PartnerItem {
  image: number
  description: string
}

// --- Принципы ---
const principleTitle = ref('')
const principleDescription = ref('')
const principleList = ref<PrincipleItem[]>([])
const lottieRefs = ref<HTMLElement[]>([])

// --- Направления ---
const directionTitle = ref('')
const directionList = ref<DirectionItem[]>([])

// --- Партнеры ---
const partnerTitle = ref('')
const partnerList = ref<PartnerItem[]>([])
const partnerImageUrls = ref<string[]>([])

// --- Кнопка ---
const buttonFormHref = ref<string>('#form')
const buttonFormTitle = ref<string>('Обсудить проект')
const buttonFormOption = ref<'bg-blur' | 'bg-white' | 'bg-red'>('bg-red')

// Функция для получения URL медиафайла по ID
async function getMediaUrl(id: number): Promise<string | null> {
  try {
    const media = await fetchData(`media/${id}`, '?_fields=source_url')
    return media?.source_url ?? null
  } catch (e) {
    console.warn(`Не удалось получить media для ID ${id}:`, e)
    return null
  }
}

onMounted(async () => {
  try {
    const response = await fetchData('pages/16', '?_fields=acf')

    if (response?.acf) {
      // Заполняем данные по принципам
      principleTitle.value = response.acf.principle__title ?? ''
      principleDescription.value = response.acf.principle__description ?? ''
      principleList.value = response.acf.repeater_principle ?? []

      // Заполняем данные по направлениям
      directionTitle.value = response.acf.direction_title ?? ''
      directionList.value = response.acf.repeater_direction ?? []

      // Заполняем данные по направлениям
      partnerTitle.value = response.acf.partner_title ?? ''
      partnerList.value = response.acf.repeater_partner ?? []

      const imageUrls = await Promise.all(
          partnerList.value.map(item => getMediaUrl(item.image))
      )
      partnerImageUrls.value = imageUrls.map(url => url ?? '')

      // lottie
      const urls = await Promise.all(
          principleList.value.map(item => getMediaUrl(item.icon))
      )

      await nextTick()

      // Инициализируем lottie-анимации
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

      await nextTick()

      const sections = document.querySelectorAll('.information__content > div')
      const menuItems = document.querySelectorAll('.information__paragraph__item')

      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          toggleActions: 'play reverse play reverse',
          onEnter: () => setActive(index),
          onEnterBack: () => setActive(index),
        })
      })

      function setActive(index: number) {
        menuItems.forEach((item, i) => {
          item.classList.toggle('active', i === index)
        })
      }
    } else {
      console.warn('Неполные данные:', response)
    }
  } catch (error) {
    console.error('Ошибка при загрузке:', error)
  }
})
</script>

<template>
  <div class="container information grid-12">
    <div class="information__paragraph__inner">
      <div class="information__paragraph">
        <div class="information__paragraph__item">
          <div class="information__paragraph__item__title">
            <div class="information__paragraph__item__title__number p2">01</div>
            <div class="information__paragraph__item__title__name p2">{{ principleTitle }}</div>
          </div>
          <div class="information__paragraph__item__progress"></div>
        </div>
        <div class="information__paragraph__item">
          <div class="information__paragraph__item__title">
            <div class="information__paragraph__item__title__number p2">02</div>
            <div class="information__paragraph__item__title__name p2">{{ directionTitle }}</div>
          </div>
          <div class="information__paragraph__item__progress"></div>
        </div>
        <div class="information__paragraph__item">
          <div class="information__paragraph__item__title">
            <div class="information__paragraph__item__title__number p2">03</div>
            <div class="information__paragraph__item__title__name p2">{{ partnerTitle }}</div>
          </div>
          <div class="information__paragraph__item__progress"></div>
        </div>
      </div>
    </div>
    <div class="information__content">
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
      <div class="partner">
        <h2 class="partner__title h2">{{ partnerTitle }}</h2>
        <div class="partner__list__inner">
          <div class="partner__list">
            <div class="partner__item" v-for="(item, index) in partnerList" :key="index">
              <img :src="partnerImageUrls[index]" alt="" class="partner__item__image" loading="lazy">
              <p class="partner__item__description p2">{{ item.description }}</p>
            </div>
          </div>
          <div class="partner__list">
            <div class="partner__item" v-for="(item, index) in partnerList" :key="index">
              <img :src="partnerImageUrls[index]" alt="" class="partner__item__image" loading="lazy">
              <p class="partner__item__description p2">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>