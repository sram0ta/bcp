<script setup lang="ts">
interface SectionHero {
  hello_title?: string
  hello_icon?: number
  hello_description?: string
  hello_button?: {
    title: string
    url: string
    target: string
  }
}

import {ref, onMounted, nextTick} from 'vue'
import { WpApi } from '~/composables/WpApi'
import { BlockAnimation, FadeInAnimation } from '~/composables/animation/BlockAnimation'
import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SplitText from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

const heroData = ref<SectionHero | null>(null);
const heroIconUrl = ref<string>('');
const heroIconAlt = ref<string>('');
const heroDescription = ref<string>('');
const heroButtonTitle = ref<string>('');
const heroButtonHref = ref<string>('');
const heroButtonTarget = ref<'_self' | '_blank' | undefined>('_self')
const heroButtonOption = ref<'bg-white' | 'bg-blur' | 'bg-red' | undefined>('bg-white')

const { fetchData } = WpApi();

onMounted(async () => {
  try {
    const response = await fetchData<{ acf: SectionHero }>('pages/16', '?_fields=acf');

    ScrollTrigger.refresh();

    if (response?.acf) {
      heroData.value = response.acf;

      heroDescription.value = response.acf.hello_description || '';

      heroButtonTitle.value = 'Обсудить проект';
      heroButtonHref.value = '/#tell-us';
      heroButtonTarget.value = '_self';
      heroButtonOption.value = 'bg-white';

      if (response.acf.hello_icon) {
        const media = await fetchData<any>(`media/${response.acf.hello_icon}`, '');
        heroIconUrl.value = media?.source_url || '';
        heroIconAlt.value = media?.alt_text || '';
      }

      await nextTick()
      ScrollTrigger.refresh()

      const tl = gsap.timeline()

      await BlockAnimation('.animate-title', tl)
      FadeInAnimation('.animate-opacity', tl)
    } else {
      console.warn('Неполные данные:', response);
    }
  } catch (error) {
    console.error('Ошибка при загрузке:', error);
  }
});


const titleWords = computed(() => {
  return heroData.value?.hello_title?.trim().split(' ') || []
});
</script>

<template>
  <div class="container hero">
    <h1 class="hero__title__inner h1 animate-title">
      <span class="hero__title">{{ titleWords[0] }}</span>
      <span class="hero__title__wrapper">
        <img
            :src="heroIconUrl"
            :alt="heroIconAlt"
            class="hero__title__icon"
        />
        <span class="hero__title">{{ titleWords[1] }}</span>
      </span>
      <span class="hero__title">{{ titleWords[2] }}</span>
    </h1>
    <div class="hero__description p1 animate-opacity">{{ heroDescription }}</div>
    <div class="button-container animate-opacity">
      <ui-button
        :href="heroButtonHref"
        :title="heroButtonTitle"
        :option="heroButtonOption"
        :target="heroButtonTarget"
      />
    </div>
  </div>
</template>

<style scoped>

</style>

