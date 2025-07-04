<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import lottie from 'lottie-web'
import animationData from '@/assets/images/preloader.json'
import { WpApi } from '@/composables/WpApi'
import { isPreloaderDone } from '@/composables/animation/BlockAnimation'
const { fetchData } = WpApi()

const isScrolled = ref(false)
const isMobile = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 90
}

// Бургер
const isBurgerActive = ref(false)
function openBurger() {
  isBurgerActive.value = !isBurgerActive.value
}

// Кнопки
const headerButtons = [
  { href: '#about-us', title: 'О нас', option: 'bg-blur' },
  { href: '#directions', title: 'Направления', option: 'bg-blur' },
  { href: '#tell-us', title: 'Обсудить проект', option: 'bg-white' },
]

const buttonFormHref = ref('#tell-us')
const buttonFormTitle = ref('Обсудить проект')
const buttonFormOption = ref<'bg-blur' | 'bg-white' | 'bg-red'>('bg-red')

// Прелоадер
const preloaderRef = ref<HTMLElement | null>(null)
const preloaderLogoRef = ref<HTMLElement | null>(null)

// Контакты
const contactEmail = ref('')
const contactPhone = ref('')
const presentationFile = ref('',)

const burgerNavRef = ref<HTMLElement | null>(null)


onMounted(async () => {
  isMobile.value = window.innerWidth <= 768

  if (burgerNavRef.value) {
    const links = burgerNavRef.value.querySelectorAll('a[href^="#"]')
    links.forEach(link => {
      link.addEventListener('click', () => {
        isBurgerActive.value = false
      })
    })
  }

  window.addEventListener('scroll', handleScroll)

  try {
    const response = await fetch('https://api.b-dp.ru/wp-json/custom/v1/options')
    if (!response.ok) throw new Error('Ошибка при получении данных')
    const pageData = await response.json()

    if (pageData?.acf) {
      contactEmail.value = pageData.acf['e-mail'] || ''
      contactPhone.value = pageData.acf.phone || ''
      presentationFile.value = pageData.acf['presentation'] || ''
    }

    console.log('ACF Options:', pageData)
  } catch (err) {
    console.error('Ошибка загрузки данных ACF:', err)
  }

  if (preloaderLogoRef.value && preloaderRef.value) {
    const anim = lottie.loadAnimation({
      container: preloaderLogoRef.value,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
      },
    })

    anim.addEventListener('complete', () => {
      preloaderRef.value?.classList.add('preloader__done')
      isPreloaderDone.value = true
    })
  }
})

const contactPhoneClean = computed(() => {
  return contactPhone.value.replace(/[^\d+]/g, '')
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <img src="/assets/images/video.webp" alt="" class="background-video" />

  <div class="preloader" ref="preloaderRef">
    <img src="/assets/images/video.webp" alt="" class="preloader__background" />
    <div class="preloader__logo" ref="preloaderLogoRef"></div>
  </div>

  <header :class="['header grid-12', { hidden: isScrolled && !isMobile }]">
    <nuxt-link to="/" class="header__logo">
      <svg width="240" height="68" viewBox="0 0 240 68" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M53.3333 27.2H13.3333V13.6H53.3333V0H0V68H53.3333V54.4H13.3333V40.8H53.3333V54.4H66.6667V27.2H53.3333Z" fill="#F2F2F2"/>
        <path d="M80.0022 0H93.3355V54.4H80.0022V0ZM146.669 54.4V0H133.336V54.4H93.3355V68H160.002V54.4H146.669Z" fill="#F2F2F2"/>
        <path d="M239.999 13.6H226.665V68H239.999V13.6Z" fill="#F2F2F2"/>
        <path d="M173.333 0V68H186.666V13.6H226.666V0H173.333Z" fill="#F2F2F2"/>
      </svg>
    </nuxt-link>
    <div class="header__info">
      <a :href="`tel:${contactPhoneClean}`" class="header__info__link p2">
        <svg width="12" height="12"><rect width="12" height="12" rx="2" fill="#F2F2F2"/></svg>
        {{ contactPhone }}
      </a>
      <a :href="presentationFile" class="header__info__link p2" download>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="10" height="10" rx="2" fill="#F2F2F2"/>
          <path d="M5 2V7.33333M5 7.33333L7 5.33333M5 7.33333L3 5.33333M3 8H7" stroke="#3C3C3C"/>
        </svg>
        Скачать презентацию (PDF)
      </a>
    </div>
    <div class="header__buttons">
      <ui-button
          v-for="(headerButton, index) in headerButtons"
          :key="index"
          :href="headerButton.href"
          :title="headerButton.title"
          :option="headerButton.option"
      />
    </div>
  </header>
  <div class="burger" :class="{ 'active': isScrolled, 'open': isBurgerActive }" @click="openBurger">
    <div class="burger__inner">
      <div class="burger__item"></div>
      <div class="burger__item"></div>
    </div>
  </div>
  <div class="burger-menu" :class="{ open: isBurgerActive }">
    <div class="burger-menu__inner">
      <nav class="burger-menu__navigation" ref="burgerNavRef">
        <a href="#about-us" class="burger-menu__item h3">О нас</a>
        <a href="#directions" class="burger-menu__item h3">Направления</a>
        <a href="#projects" class="burger-menu__item h3">Наши проекты</a>
        <a href="#contacts" class="burger-menu__item h3">Контакты</a>
      </nav>
    </div>
    <div class="burger-menu__inner">
      <div class="burger-menu-contacts">
        <div class="burger-menu__block">
          <div class="burger-menu__block__title p1">Email</div>
          <a :href="`mailto:${contactEmail}`" class="burger-menu__item h3">{{ contactEmail }}</a>
        </div>
        <div class="burger-menu__block">
          <div class="burger-menu__block__title p1">Телефон</div>
          <a :href="`tel:${contactPhoneClean}`" class="burger-menu__item h3">{{ contactPhone }}</a>
        </div>
        <a :href="presentationFile" class="burger-menu__download p1" download>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="14" height="14" rx="3" fill="#232222"/>
            <path d="M7 2V10M7 10L10 7M7 10L4 7M4 11H10" stroke="#F2F2F2"/>
          </svg>
          Скачать презентацию (PDF)
        </a>
      </div>
      <ui-button
          :href="buttonFormHref"
          :title="buttonFormTitle"
          :option="buttonFormOption"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
