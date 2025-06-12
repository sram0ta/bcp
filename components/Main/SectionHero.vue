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

import { ref, onMounted, computed } from 'vue'
import { WpApi } from '~/composables/WpApi'

const heroData = ref<SectionHero | null>(null);
const heroIconUrl = ref<string>('');
const heroIconAlt = ref<string>('');
const heroDescription = ref<string>('');
const heroButtonTitle = ref<string>('');
const heroButtonHref = ref<string>('');
const heroButtonTarget = ref<string>('');
const heroButtonOption = ref<string>('');

const { fetchData } = WpApi();

onMounted(async () => {
  try {
    const response = await fetchData<SectionHero>('pages/16', '?_fields=acf')

    if (response?.acf) {
      heroData.value = response.acf

      heroDescription.value = response.acf.hello_description;
      heroButtonTitle.value = response.acf.hello_button.title;
      heroButtonHref.value = response.acf.hello_button.url
      heroButtonTarget.value = response.acf.hello_bu
      heroButtonOption.value = 'bg-white';

      if (response.acf.hello_icon) {
        const media = await fetchData<any>(`media/${response.acf.hello_icon}`, '')

        heroIconUrl.value = media?.source_url || ''
        heroIconAlt.value = media?.alt_text || ''
      }
    } else {
      console.warn('Неполные данные:', response)
    }
  } catch (error) {
    console.error('Ошибка при загрузке:', error)
  }
});

const titleWords = computed(() => {
  return heroData.value?.hello_title?.trim().split(' ') || []
});
</script>


<template>
  <div class="container hero">
    <div class="hero__title__inner">
      <h1 class="hero__title">{{ titleWords[0] }}</h1>
      <div class="hero__title__wrapper">
        <img
            :src="heroIconUrl"
            :alt="heroIconAlt"
            class="hero__title__icon"
        />
        <h1 class="hero__title">{{ titleWords[1] }}</h1>
      </div>
      <h1 class="hero__title">{{ titleWords[2] }}</h1>
    </div>
    <div class="hero__description p1">{{ heroDescription }}</div>
    <ui-button
      :href="heroButtonHref"
      :title="heroButtonTitle"
      :option="heroButtonOption"
      :target="heroButtonTarget"
    />
  </div>
</template>

<style scoped>

</style>

