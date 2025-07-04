<script setup>

import SectionHero from "~/components/Main/SectionHero.vue";
import SectionAbout from "~/components/Main/SectionAbout.vue";
import SectionPride from "~/components/Main/SectionPride.vue";
import SectionInformation from "~/components/Main/SectionInformation.vue";
import {useAnimations} from "~/composables/animation/BlockAnimation.js";

const { scrollDirectionShiftAnimation } = useAnimations()

onMounted(() => {
  scrollDirectionShiftAnimation(document.body, '.animate-shift')
})
</script>

<template>
  <div class="main-image-1 animate-shift"></div>
  <main class="main-index">
    <SectionHero />
    <SectionAbout />
    <div class="main-image-2 animate-shift"></div>
    <SectionPride />
    <SectionInformation />
  </main>
</template>

<style >
  .main-image-1 {
    position: absolute;
    top: 15rem;
    right: 0;
    width: 74.1rem;
    height: 76.55rem;
    background-image: url('@/assets/images/box1.png');
    background-repeat: no-repeat;
    background-position: right;
    background-size: contain;
    mix-blend-mode: multiply;
    opacity: 0.7;
    z-index: 0;

    @media (max-width: 576px) {
      top: 15.5rem;
      width: 100%;
      height: 25rem;
      right: initial;
    }
  }

  .main-image-2 {
    position: absolute;
    top: 92.9rem;
    left: 0;
    width: 74.1rem;
    height: 76.55rem;
    background-image: url('@/assets/images/box2.png');
    background-repeat: no-repeat;
    background-position: right;
    background-size: contain;
    mix-blend-mode: multiply;
    opacity: 0.7;
    z-index: 0;

    @media (max-width: 576px) {
      top: 60rem;
      width: 100%;
      height: 25rem;
      right: initial;
    }
  }

</style>