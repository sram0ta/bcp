<script setup lang="ts">
interface ButtonProps {
  href?: string,
  title?: string,
  option?: 'bg-blur' | 'bg-white' | 'bg-red',
  target?: '_self' | '_blank',
}

const props = withDefaults(defineProps<ButtonProps>(), {
  href: '#',
  title: 'Обсудить проект',
  option: 'bg-blur',
  target: '_self',
})
</script>

<template>
  <a :href="href" :class="['button-ui', `button-ui_${option}`]" :target="target">
    <span class="button-ui__inner p2">
      <span class="button-ui__title ">{{ title }}</span>
      <span class="button-ui__title ">{{ title }}</span>
    </span>
  </a>
</template>

<style lang="scss" scoped>
.button-ui{
  width: min-content;
  white-space: nowrap;
  padding: 1rem 1.5rem;
  border-radius: 100px;
  box-sizing: border-box;

  @media (max-width: 1366px) {
    padding: .75rem 1rem;
  }

  &_bg-blur{
    background: #FFFFFF4D;
    backdrop-filter: blur(30px);
  }

  &_bg-white{
    background: #F2F2F2;

    .button-ui__title{
      color: #3C3C3C;
    }
  }

  &_bg-red{
    background-color: #E72121;
    display: flex;
    justify-content: center;
  }

  &:hover{

    .button-ui__title{
      transition: .5s;

      &:first-child{
        transform: translateY(-100%);
      }

      &:last-child{
        transform: translateY(0);
      }
    }
  }

  &__inner{
    position: relative;
    overflow: hidden;
    display: inline-block;
  }

  &__title{
    transition: .5s;

    &:first-child{
      position: relative;
      display: inline-block;
    }

    &:last-child{
      position: absolute;
      left: 0;
      top: 0;
      transform: translateY(100%);
    }
  }
}
</style>