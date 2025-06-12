<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import prideScrollAnimation from '~/composables/animation/pride'
import ScrollTrigger from 'gsap/ScrollTrigger'

const prideRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  await nextTick()
  if (prideRef.value) {
    prideScrollAnimation(prideRef.value)
  }

  ScrollTrigger.refresh();
})
</script>

<template>
  <div class="container pride">
    <div class="pride__inner" ref="prideRef">
      <h2 class="pride__title p3">Чем мы гордимся</h2>
      <p class="pride__description p1">Метрики успеха</p>
      <div class="pride__list">
        <div class="pride__item">
          <div class="pride__item__inner">
            <div class="pride__item__icon">
              <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="26" height="26" rx="3" fill="#F6F6F6"/>
                <rect x="13.5" y="13.5" width="25" height="25" rx="2.5" stroke="#F6F6F6"/>
              </svg>
            </div>
            <p class="pride__item__title h3">Каждый 7й человек на земле</p>
          </div>
          <p class="pride__item__description p1">Каждый 7й человек на земле видел наши рекламные кампании</p>
        </div>
        <div class="pride__item">
          <div class="pride__item__inner">
            <div class="pride__item__icon">
              <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="26" height="26" rx="3" fill="#F6F6F6"/>
                <rect x="13.5" y="13.5" width="25" height="25" rx="2.5" stroke="#F6F6F6"/>
              </svg>
            </div>
            <p class="pride__item__title h3">Каждый 7й человек на земле</p>
          </div>
          <p class="pride__item__description p1">Каждый 7й человек на земле видел наши рекламные кампании</p>
        </div>
        <div class="pride__item">
          <div class="pride__item__inner">
            <div class="pride__item__icon">
              <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="26" height="26" rx="3" fill="#F6F6F6"/>
                <rect x="13.5" y="13.5" width="25" height="25" rx="2.5" stroke="#F6F6F6"/>
              </svg>
            </div>
            <p class="pride__item__title h3">Каждый 7й человек на земле</p>
          </div>
          <p class="pride__item__description p1">Каждый 7й человек на земле видел наши рекламные кампании</p>
        </div>
        <div class="pride__item">
          <div class="pride__item__inner">
            <div class="pride__item__icon">
              <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="26" height="26" rx="3" fill="#F6F6F6"/>
                <rect x="13.5" y="13.5" width="25" height="25" rx="2.5" stroke="#F6F6F6"/>
              </svg>
            </div>
            <p class="pride__item__title h3">Каждый 7й человек на земле</p>
          </div>
          <p class="pride__item__description p1">Каждый 7й человек на земле видел наши рекламные кампании</p>
        </div>
        <div class="pride__item">
          <div class="pride__item__inner">
            <div class="pride__item__icon">
              <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="26" height="26" rx="3" fill="#F6F6F6"/>
                <rect x="13.5" y="13.5" width="25" height="25" rx="2.5" stroke="#F6F6F6"/>
              </svg>
            </div>
            <p class="pride__item__title h3">Каждый 7й человек на земле</p>
          </div>
          <p class="pride__item__description p1">Каждый 7й человек на земле видел наши рекламные кампании</p>
        </div>
      </div>
    </div>
  </div>
</template>
