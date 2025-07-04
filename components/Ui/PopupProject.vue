<script setup lang="ts">
defineProps<{
  project: {
    title: string
    description: string
    bigDescription: string
    siteUrl: string
    imageUrl: string
  } | null
}>()

const emit = defineEmits(['close'])
</script>

<template>
  <div class="popup-project container grid-12">
    <div class="popup-project__background"></div>
    <div class="popup-project__exit" @click="emit('close')">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32.2844 32.7055L4.00008 4.42121M4 31.2843L32.2843 3" stroke="#232222" stroke-width="2"/>
      </svg>
    </div>
    <div class="popup-project__content">
      <div class="popup-project__content__title">
        <img :src="project?.imageUrl" alt="image" class="popup-project__content__title__image">
        <div class="h4">{{ project?.title }}</div>
      </div>
      <p class="popup-project__content__description p1">{{ project?.description }}</p>
      <div class="popup-project__content__inner">
        <p class="popup-project__content__sub-title p1">Подробнее о проекте</p>
        <p class="popup-project__content__description p1">{{ project?.bigDescription }}</p>
      </div>
      <a href="#" class="button-underline" v-if="project?.siteUrl">
        <span class="button-underline__inner p2">
          <span class="button-underline__title">Ссылка на сайт</span>
          <span class="button-underline__title">Ссылка на сайт</span>
        </span>
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .popup-project{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999999999999;
    grid-template-rows: min-content;

    &__background{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #080808CC;
      z-index: -1;
    }

    &__exit{
      cursor: pointer;
      grid-column: 5 / 6;
      margin-top: 2rem;
      justify-self: flex-end;
      width: 4.65rem;
      height: 4.65rem;
      background-color: #F2F2F2;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 1rem;

      @media (max-width: 1440px) {
        margin-top: 1rem;
        justify-self: flex-end;
        width: 4rem;
        height: 4rem;
      }

      @media (max-width: 576px) {
        grid-column: 1 / -1;
        margin-top: .5rem;
        justify-self: flex-end;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: .5rem;
      }

      svg{
        width: 1.6rem;
        height: 1.6rem;

        @media (max-width: 1440px) {
          width: 1.4rem;
          height: 1.4rem;
        }

        @media (max-width: 576px) {
          width: .75rem;
          height: .75rem;
        }
      }
    }

    &__content{
      grid-column: 6 / -1;
      background-color: #F2F2F2;
      margin: 2rem 0;
      border-radius: 2rem;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 2.5rem 0;
      overflow: auto;
      -ms-overflow-style: none;
      scrollbar-width: none;

      @media (max-width: 1440px) {
        margin: 1rem 0;
        border-radius: 1.5rem;
        gap: 2rem 0;
      }

      @media (max-width: 576px) {
        grid-column: 1 / -1;
        margin: .5rem 0;
        padding: 1rem;
        border-radius: 1rem;
        gap: 1rem 0;
      }

      &::-webkit-scrollbar {
        display: none;
      }

      &__title{
        display: flex;
        align-items: center;
        gap: 0 1rem;

        @media (max-width: 576px) {
          gap: 0 .5rem;
        }

        &__image{
          width: 4.65rem;
          height: 4.65rem;
          object-fit: cover;
          object-position: center;
          border-radius: 2rem;

          @media (max-width: 1440px) {
            width: 4rem;
            height: 4rem;
            border-radius: 1rem;
          }

          @media (max-width: 576px) {
            width: 3rem;
            height: 3rem;
            border-radius: .75rem;
          }
        }

        .h4{
          color: #232222;
        }
      }

      &__description{
        color: #232222;
        max-width: 31.1rem;

        @media (max-width: 1440px) {
          max-width: 28.2rem;
        }
      }

      &__sub-title{
        color: #5A5959;
      }

      &__inner{
        display: flex;
        flex-direction: column;
        gap: 1rem 0;
      }
    }
  }
</style>