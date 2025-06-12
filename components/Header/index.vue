<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const headerButtons = [
  { href: '#about-us', title: 'О нас', option: 'bg-blur' },
  { href: '#directions', title: 'Направления', option: 'bg-blur' },
  { href: '#tell-us', title: 'Обсудить проект', option: 'bg-white' },
]

const isScrolled = ref(false)
let lastScrollY = 0

const handleScroll = () => {
  const currentScrollY = window.scrollY
  isScrolled.value = currentScrollY > lastScrollY && currentScrollY > 90
  lastScrollY = currentScrollY
}

const isBurgerActive = ref(false)

function openBurger() {
  isBurgerActive.value = !isBurgerActive.value
}

// Кнопка обратной связи
const buttonFormHref = ref<string>('#form')
const buttonFormTitle = ref<string>('Обсудить проект')
const buttonFormOption = ref<'bg-blur' | 'bg-white' | 'bg-red'>('bg-red')


onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header :class="['header grid-12', { 'hidden': isScrolled }]">
    <nuxt-link to="/" class="header__logo">
      <svg width="240" height="68" viewBox="0 0 240 68" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M53.3333 27.2H13.3333V13.6H53.3333V0H0V68H53.3333V54.4H13.3333V40.8H53.3333V54.4H66.6667V27.2H53.3333Z" fill="#F2F2F2"/>
        <path d="M80.0022 0H93.3355V54.4H80.0022V0ZM146.669 54.4V0H133.336V54.4H93.3355V68H160.002V54.4H146.669Z" fill="#F2F2F2"/>
        <path d="M239.999 13.6H226.665V68H239.999V13.6Z" fill="#F2F2F2"/>
        <path d="M173.333 0V68H186.666V13.6H226.666V0H173.333Z" fill="#F2F2F2"/>
      </svg>
    </nuxt-link>
    <div class="header__info">
      <a href="tel:+74950188889" class="header__info__link p2">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="14" height="14" rx="3" fill="#F2F2F2"/>
          <path d="M7 2V10M7 10L10 7M7 10L4 7M4 11H10" stroke="#3C3C3C"/>
        </svg>
        +7 (495) 018-88-89
      </a>
      <a href="#" class="header__info__link p2">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="14" height="14" rx="3" fill="#F2F2F2"/>
          <path d="M7 2V10M7 10L10 7M7 10L4 7M4 11H10" stroke="#3C3C3C"/>
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
  <div class="burger" :class="{ 'active': isScrolled, 'open': isBurgerActive}" @click="openBurger">
    <div class="burger__inner">
      <div class="burger__item"></div>
      <div class="burger__item"></div>
    </div>
  </div>
  <div class="burger-menu" :class="{ 'open': isBurgerActive && isScrolled}">
    <div class="burger-menu__inner">
      <nav class="burger-menu__navigation">
        <a href="#about-us" class="burger-menu__item h3">О нас</a>
        <a href="#directions" class="burger-menu__item h3">Направления</a>
        <a href="#projects" class="burger-menu__item h3">Наши проекты</a>
        <a href="#contacts" class="burger-menu__item h3">контакты</a>
      </nav>
    </div>
    <div class="burger-menu__inner">
      <div class="burger-menu-contacts">
        <div class="burger-menu__block">
          <div class="burger-menu__block__title p1">Email</div>
          <a href="mailto:info@b-dp.ru" class="burger-menu__item h3">info@b-dp.ru</a>
        </div>
        <div class="burger-menu__block">
          <div class="burger-menu__block__title p1">Телефон</div>
          <a href="tel:+74950188889" class="burger-menu__item h3">+7 (495) 018-88-89</a>
        </div>
        <a href="#" class="burger-menu__download p1" download>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="14" height="14" rx="3" fill="#232222"/>
            <path d="M7 2V10M7 10L10 7M7 10L4 7M4 11H10" stroke="#F2F2F2"/>
          </svg>
          Скачать презентацию (PDF)</a>
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