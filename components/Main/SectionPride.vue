<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import prideScrollAnimation from '~/composables/animation/pride'
import { WpApi } from '~/composables/WpApi'
import ScrollTrigger from 'gsap/ScrollTrigger'
import {useAnimations} from '~/composables/animation/BlockAnimation'
const blockRef = ref<HTMLElement | null>(null)
const { blockAnimation, fadeInAnimation } = useAnimations()

const { fetchData } = WpApi()

interface SectionPride {
  pride_title?: string
  pride_description?: string
  repeater_pride?: PrideItem[]
}

interface PrideItem {
  title: string
  description: string
}

const prideRef = ref<HTMLElement | null>(null)
const prideTitle = ref('')
const prideDescription = ref('')
const prideItems = ref<PrideItem[]>([])

onMounted(async () => {
  const response = await fetchData<{ acf: SectionPride }>('pages/16', '?_fields=acf')

  if (response?.acf) {
    prideTitle.value = response.acf.pride_title ?? ''
    prideDescription.value = response.acf.pride_description ?? ''
    prideItems.value = response.acf.repeater_pride ?? []

    await nextTick()

    if (prideRef.value) {
      prideScrollAnimation(prideRef.value)
    }

    ScrollTrigger.refresh()

    await nextTick()
    ScrollTrigger.refresh()

    await blockAnimation(blockRef.value, '.animate-title')
    fadeInAnimation(blockRef.value, '.animate-opacity')
  } else {
    console.warn('Неполные данные в pride секции', response)
  }
})
</script>

<template>
  <div class="container pride" ref="blockRef">
    <div class="pride__inner" ref="prideRef">
      <h2 class="pride__title p3 animate-title">{{ prideTitle }}</h2>
      <p class="pride__description p1 animate-opacity">{{ prideDescription }}</p>
      <div class="pride__list">
        <div
            v-for="(item, index) in prideItems"
            :key="index"
            class="pride__item">
          <div class="pride__item__inner">
            <div class="pride__item__icon">
              <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="26" height="26" rx="3" fill="#F6F6F6"/>
                <rect x="13.5" y="13.5" width="25" height="25" rx="2.5" stroke="#F6F6F6"/>
              </svg>
            </div>
            <p class="pride__item__title h3">{{ item.title }}</p>
          </div>
          <p class="pride__item__description p1">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
