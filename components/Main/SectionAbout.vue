<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { WpApi } from '~/composables/WpApi'
import aboutAnimation from '~/composables/animation/about'

const { fetchData } = WpApi();

const buttonFormHref = ref<string>('#form')
const buttonFormTitle = ref<string>('Обсудить проект')
const buttonFormOption = ref<'bg-blur' | 'bg-white' | 'bg-red'>('bg-white')

interface SectionAbout {
  about_title?: string
  about_description?: string
}

const aboutData = ref<SectionAbout | null>(null);
const aboutTitle = ref<string>('');
const aboutDescription = ref<string>('');
const aboutTitleRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  try {
    const response = await fetchData<{ acf: SectionAbout }>('pages/16', '?_fields=acf');

    if (response?.acf) {
      aboutData.value = response.acf

      console.log(aboutData)

      aboutTitle.value = response.acf.about_title ?? '';
      aboutDescription.value = response.acf.about_description ?? '';

      await nextTick();

      if (aboutTitleRef.value) {
        aboutAnimation(aboutTitleRef.value)
      }
    } else {
      console.warn('Неполные данные:', response)
    }
  } catch (error) {
    console.error('Ошибка при загрузке:', error)
  }
});

</script>

<template>
  <div class="container about grid-12">
    <div class="about__inner">
      <h2 class="about__title h2" ref="aboutTitleRef">{{ aboutTitle }}</h2>
      <p class="about__description p1">{{ aboutDescription }}</p>
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