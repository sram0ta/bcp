<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useAnimations} from '~/composables/animation/BlockAnimation'
import {WpApi} from '~/composables/WpApi'

const {scrollDirectionShiftAnimation } = useAnimations()

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const { fetchData } = WpApi()
const wpData = ref<any>(null)

const loadPageData = async () => {
  const data = await fetchData('pages', '16?_fields=acf')
  wpData.value = data?.acf || null
}

const contactEmail = ref('')
const contactPhone = ref('')
const contactAddress = ref('')
const contactAddressTitle = ref('')
const contactAddressUrl = ref('')
const presentationFile = ref('',)
const personalFile = ref('',)
const privacyFile = ref('',)


onMounted( async () =>{
  scrollDirectionShiftAnimation(document.body, '.animate-shift');

  loadPageData();

  try {
    const response = await fetch('https://api.b-dp.ru/wp-json/custom/v1/options')
    if (!response.ok) throw new Error('Ошибка при получении данных')
    const pageData = await response.json()

    if (pageData?.acf) {
      contactEmail.value = pageData.acf['e-mail'] || ''
      contactPhone.value = pageData.acf.phone || ''
      const address = pageData.acf['address'] || {}
      contactAddressTitle.value = address.title || ''
      contactAddressUrl.value = address.url || ''
      presentationFile.value = pageData.acf['presentation'] || ''
      personalFile.value = pageData.acf['personal'] || ''
      privacyFile.value = pageData.acf['privacy'] || ''
    }

    console.log(contactAddress)

    console.log('ACF Options:', pageData)
  } catch (err) {
    console.error('Ошибка загрузки данных ACF:', err)
  }

})

const contactPhoneClean = computed(() => {
  return contactPhone.value.replace(/[^\d+]/g, '')
})

</script>

<template>
  <div class="footer__inner">
    <div class="main-image-4 animate-shift"></div>
    <div class="main-image-5 animate-shift"></div>
    <footer class="footer container grid-12">
      <div class="anchor" id="contacts"></div>
      <div class="footer__information">
        <nuxt-link to="/" class="footer__information__logo">
          <svg width="240" height="68" viewBox="0 0 240 68" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M53.3333 27.2H13.3333V13.6H53.3333V0H0V68H53.3333V54.4H13.3333V40.8H53.3333V54.4H66.6667V27.2H53.3333Z" fill="#F2F2F2"/>
            <path d="M80.0022 0H93.3355V54.4H80.0022V0ZM146.669 54.4V0H133.336V54.4H93.3355V68H160.002V54.4H146.669Z" fill="#F2F2F2"/>
            <path d="M239.999 13.6H226.665V68H239.999V13.6Z" fill="#F2F2F2"/>
            <path d="M173.333 0V68H186.666V13.6H226.666V0H173.333Z" fill="#F2F2F2"/>
          </svg>
        </nuxt-link>
        <div class="footer__information__download">
          <div class="footer__information__download__link p2">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="12" height="12" rx="2" fill="#F2F2F2"/>
            </svg>
            Бюро Цифровых Проектов
          </div>
          <a :href="presentationFile" class="footer__information__download__link p2" download>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="14" height="14" rx="3" fill="#F2F2F2"/>
              <path d="M7 2V10M7 10L10 7M7 10L4 7M4 11H10" stroke="#3C3C3C"/>
            </svg>
            Скачать презентацию (PDF)
          </a>
        </div>
        <div class="footer__information__address footer__information__address_pc">
          <div class="footer__information__address__title p1">Адрес</div>
          <div class="footer__information__address__main h3">{{ contactAddressTitle }}</div>
          <a :href="contactAddressUrl" class="footer__information__address__map p1" target="_blank">Смотреть на карте</a>
        </div>
      </div>
      <div class="footer__navigation">
        <div class="footer__information__address footer__information__address_mobile">
          <div class="footer__information__address__title p1">Адрес</div>
          <div class="footer__information__address__main h3">{{ contactAddressTitle }}</div>
          <a :href="contactAddressUrl" class="footer__information__address__map p1" target="_blank">Смотреть на карте</a>
        </div>
        <div class="footer__navigation__inner">
          <div class="footer__navigation__title p1">Навигация</div>
          <a href="#about-us" class="footer__navigation__link h3">О нас</a>
          <a href="#directions" class="footer__navigation__link h3">Направления</a>
          <a href="#projects" class="footer__navigation__link h3">Наши проекты</a>
        </div>
        <div class="footer__navigation__social">
          <div class="footer__navigation__inner">
            <div class="footer__navigation__title p1">Email</div>
            <a :href="`mailto:${contactEmail}`" class="footer__navigation__link h3">{{ contactEmail }}</a>
          </div>
          <div class="footer__navigation__inner">
            <div class="footer__navigation__title p1">Телефон</div>
            <a :href="`tel:${contactPhoneClean}`" class="footer__navigation__link h3">{{ contactPhone }}</a>
          </div>
        </div>
      </div>
      <div class="footer__up" @click="scrollToTop">
        <div class="footer__up__title p2">Наверх</div>
        <div class="footer__up__icon">
          <div class="footer__up__icon__inner">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 10V1M5 1L1 5M5 1L9 5" stroke="#232222"/>
            </svg>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 10V1M5 1L1 5M5 1L9 5" stroke="#232222"/>
            </svg>
          </div>
        </div>
      </div>
      <div class="footer__slogan">
        <div class="footer__slogan__inner p3">Меняем цифровую среду</div>
        <div class="footer__slogan__inner p3">Меняем цифровую среду</div>
      </div>
      <div class="footer__privacy">
        <div class="p2">Бюро Цифровых Проектов ©2025</div>
        <a :href="privacyFile" class="p2">Политика конфеденциальности</a>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.footer__inner{
  position: relative;
  overflow: hidden;
}

.main-image-4{
  position: absolute;
  top: -13rem;
  left: 0;
  width: 76.5rem;
  height: 50.6rem;
  background-image: url('@/assets/images/box4.png');
  background-repeat: no-repeat;
  background-position: right;
  background-size: contain;
  mix-blend-mode: multiply;
  opacity: 1;
  z-index: 0;

  @media (max-width: 576px) {
    top: 23rem;
    left: 0;
    width: 100%;
    height: 15rem;
  }
}

.main-image-5{
  position: absolute;
  top: 15rem;
  right: 0;
  width: 52rem;
  height: 34.5rem;
  background-image: url('@/assets/images/box5.png');
  background-repeat: no-repeat;
  background-position: right;
  background-size: contain;
  mix-blend-mode: multiply;
  opacity: 1;
  z-index: 0;

  @media (max-width: 576px) {
    top: 5rem;
    right: -4rem;
    width: 100%;
    height: 15rem;
  }
}
</style>