<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import lottie from 'lottie-web'
import { WpApi } from '~/composables/WpApi'
import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import PopupProject from "~/components/Ui/PopupProject.vue";
import {useAnimations} from '~/composables/animation/BlockAnimation'
const blockPrincipleRef = ref<HTMLElement | null>(null)
const blockDirectionRef = ref<HTMLElement | null>(null)
const blockPartnerRef = ref<HTMLElement | null>(null)
const blockProjectsRef = ref<HTMLElement | null>(null)
const { blockAnimation, fadeInAnimation, scrollDirectionShiftAnimation } = useAnimations()
gsap.registerPlugin(ScrollTrigger)

const { fetchData } = WpApi()

// --- Интерфейсы ---
interface PrincipleItem {
  icon: number
  title: string
  description: string
}

interface DirectionItem {
  sub_title: string
  title: string
}

interface PartnerItem {
  image: number
  description: string
}

interface ProjectItem {
  title: string
  description: string
  bigDescription: string
  siteUrl: string
  imageUrl: string
}

// --- Принципы ---
const principleTitle = ref('')
const principleDescription = ref('')
const principleList = ref<PrincipleItem[]>([])
const lottieRefs = ref<HTMLElement[]>([])

// --- Направления ---
const directionTitle = ref('')
const directionList = ref<DirectionItem[]>([])

// --- Партнеры ---
const partnerTitle = ref('')
const partnerList = ref<PartnerItem[]>([])
const partnerImageUrls = ref<string[]>([])

// --- Проекты ---
const projectTitle = ref('')
const allProjects = ref<ProjectItem[]>([])
const visibleProjects = ref<ProjectItem[]>([])

const projectsPerPage = 4
let currentPage = 1

const isPopupOpen = ref(false)
const selectedProject = ref<ProjectItem | null>(null)

function openPopup(project: ProjectItem) {
  selectedProject.value = project
  isPopupOpen.value = true
  document.body.classList.add('fixed')
}

function closePopup() {
  isPopupOpen.value = false
  selectedProject.value = null
  document.body.classList.remove('fixed')
}

// --- Форма обратной связи ---
const formTitle = ref('')
const formDescription = ref('')

// --- Кнопка ---
const buttonFormHref = ref<string>('#tell-us')
const buttonFormTitle = ref<string>('Обсудить проект')
const buttonFormOption = ref<'bg-blur' | 'bg-white' | 'bg-red'>('bg-red')

// --- Получение media URL ---
async function getMediaUrl(id: number): Promise<string> {
  try {
    const media = await fetchData(`media/${id}`, '?_fields=source_url')
    return media?.source_url ?? ''
  } catch (e) {
    console.warn(`Ошибка получения media для ID ${id}:`, e)
    return ''
  }
}

// --- Подгрузка всех проектов ---
async function loadAllProjects() {
  const projectsResponse = await fetchData('projects', '?_fields=acf,title')

  if (Array.isArray(projectsResponse)) {
    const tempProjects: ProjectItem[] = []

    for (const item of projectsResponse) {
      const title = item.title?.rendered ?? ''
      const description = item.acf?.small_description ?? ''
      const bigDescription = item.acf?.big_description ?? ''
      const siteUrl = item.acf?.link ?? ''
      const imageId = item.acf?.image ?? null

      const imageUrl = await getMediaUrl(imageId)
      tempProjects.push({
        title,
        description,
        bigDescription,
        siteUrl,
        imageUrl,
      })
    }

    allProjects.value = tempProjects
    loadNextProjects()
  }
}

// --- Пагинация по 4 проекта ---
function loadNextProjects() {
  const start = (currentPage - 1) * projectsPerPage
  const end = start + projectsPerPage
  const nextProjects = allProjects.value.slice(start, end)

  visibleProjects.value.push(...nextProjects)
  currentPage++;

  ScrollTrigger.refresh();
}

const name: Ref<string> = ref('')
const email: Ref<string> = ref('')
const phone: Ref<string> = ref('')
const message: Ref<string> = ref('')

const statusMessage: Ref<string> = ref('')
const statusSuccess: Ref<boolean> = ref(false)

type Field = 'name' | 'email' | 'phone'

const errors: Ref<Record<Field, boolean>> = ref({
  name: false,
  email: false,
  phone: false,
})

const isFormSubmitted: Ref<boolean> = ref(false)

function validateField(field: Field, value: string) {
  if (isFormSubmitted.value) return
  errors.value[field] = !value.trim()
}

watch(name, (newVal: string) => {
  validateField('name', newVal)
})
watch(email, (newVal: string) => {
  if (isFormSubmitted.value) return

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const isValid = emailRegex.test(newVal.trim())
  errors.value.email = !isValid
})

watch(phone, (newVal: string) => {
  const cleaned = newVal.replace(/[^\d+]/g, '')
  if (newVal !== cleaned) {
    phone.value = cleaned
  }

  if (!isFormSubmitted.value) {
    validateField('phone', cleaned)
  }
})

function validateForm(): boolean {
  validateField('name', name.value)
  validateField('email', email.value)
  validateField('phone', phone.value)

  return !(errors.value.name || errors.value.email || errors.value.phone)
}

async function submitForm() {
  statusMessage.value = ''
  statusSuccess.value = false
  isFormSubmitted.value = false

  if (!validateForm()) {
    statusMessage.value = 'Пожалуйста, заполните обязательные поля.'
    statusSuccess.value = false
    return
  }

  try {
    const response = await fetch('https://bcp-api.kn-dev.ru/wp-json/custom/v1/send-mail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        phone: phone.value,
        message: message.value,
      }),
    })

    const data: { success: boolean; message: string } = await response.json()

    if (response.ok && data.success) {
      statusMessage.value = data.message
      statusSuccess.value = true

      // Сброс формы
      name.value = ''
      email.value = ''
      phone.value = ''
      message.value = ''

      errors.value = {
        name: false,
        email: false,
        phone: false,
      }

      isFormSubmitted.value = true

      setTimeout(() => {
        isFormSubmitted.value = false
      }, 300)

    } else {
      statusMessage.value = data.message || 'Ошибка отправки'
      statusSuccess.value = false
    }
  } catch (e) {
    statusMessage.value = 'Ошибка сети. Попробуйте позже.'
    statusSuccess.value = false
  }
}

onMounted(async () => {
  try {
    const response = await fetchData('pages/16', '?_fields=acf')

    if (response?.acf) {
      // --- Принципы ---
      principleTitle.value = response.acf.principle__title ?? ''
      principleDescription.value = response.acf.principle__description ?? ''
      principleList.value = response.acf.repeater_principle ?? []

      // --- Направления ---
      directionTitle.value = response.acf.direction_title ?? ''
      directionList.value = response.acf.repeater_direction ?? []

      // --- Партнеры ---
      partnerTitle.value = response.acf.partner_title ?? ''
      partnerList.value = response.acf.repeater_partner ?? []

      const partnerUrls = await Promise.all(
          partnerList.value.map(p => getMediaUrl(p.image))
      )
      partnerImageUrls.value = partnerUrls

      // --- Анимации (Lottie) ---
      const iconUrls = await Promise.all(
          principleList.value.map(p => getMediaUrl(p.icon))
      )

      await nextTick()

      lottieRefs.value.forEach((el, i) => {
        const url = iconUrls[i]
        if (url && el) {
          lottie.loadAnimation({
            container: el,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: url,
          })
        }
      })

      await nextTick()

      const sections = document.querySelectorAll('.information__content > div')
      const menuItems = document.querySelectorAll('.information__paragraph__item')

      function setActive(index: number) {
        menuItems.forEach((item, i) => {
          item.classList.toggle('active', i === index)
        })
      }

      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          toggleActions: 'play reverse play reverse',
          onEnter: () => setActive(index),
          onEnterBack: () => setActive(index),
        })
      })

      // --- Проекты ---
      projectTitle.value = response.acf.project__title ?? ''
      await loadAllProjects()

      formTitle.value = response.acf.form_title ?? ''
      formDescription.value = response.acf.form_description ?? ''

      ScrollTrigger.refresh();

      await nextTick()
      ScrollTrigger.refresh()

      scrollDirectionShiftAnimation(document.body, '.animate-shift')

      await blockAnimation(blockPrincipleRef.value, '.animate-title')
      fadeInAnimation(blockPrincipleRef.value, '.animate-opacity')

      await blockAnimation(blockDirectionRef.value, '.animate-title')
      fadeInAnimation(blockDirectionRef.value, '.animate-opacity')

      await blockAnimation(blockPartnerRef.value, '.animate-title')
      fadeInAnimation(blockPartnerRef.value, '.animate-opacity')

      await blockAnimation(blockProjectsRef.value, '.animate-title')
      fadeInAnimation(blockProjectsRef.value, '.animate-opacity')

    } else {
      console.warn('Неполные данные страницы:', response)
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error)
  }
})
</script>


<template>
  <div class="container information grid-12">
    <div class="information__paragraph__inner">
      <div class="information__paragraph">
        <div class="information__paragraph__item">
          <div class="information__paragraph__item__title">
            <div class="information__paragraph__item__title__number p2">01</div>
            <div class="information__paragraph__item__title__name p2">{{ principleTitle }}</div>
          </div>
          <div class="information__paragraph__item__progress"></div>
        </div>
        <div class="information__paragraph__item">
          <div class="information__paragraph__item__title">
            <div class="information__paragraph__item__title__number p2">02</div>
            <div class="information__paragraph__item__title__name p2">{{ directionTitle }}</div>
          </div>
          <div class="information__paragraph__item__progress"></div>
        </div>
        <div class="information__paragraph__item">
          <div class="information__paragraph__item__title">
            <div class="information__paragraph__item__title__number p2">03</div>
            <div class="information__paragraph__item__title__name p2">{{ partnerTitle }}</div>
          </div>
          <div class="information__paragraph__item__progress"></div>
        </div>
        <div class="information__paragraph__item">
          <div class="information__paragraph__item__title">
            <div class="information__paragraph__item__title__number p2">04</div>
            <div class="information__paragraph__item__title__name p2">{{ projectTitle }}</div>
          </div>
          <div class="information__paragraph__item__progress"></div>
        </div>
        <div class="information__paragraph__item">
          <div class="information__paragraph__item__title">
            <div class="information__paragraph__item__title__number p2">05</div>
            <div class="information__paragraph__item__title__name p2">Контакты</div>
          </div>
          <div class="information__paragraph__item__progress"></div>
        </div>
      </div>
    </div>
    <div class="information__content__inner">
      <div class="main-image-3 animate-shift"></div>
      <div class="information__content">
        <div class="principle grid-12" ref="blockPrincipleRef">
          <h2 class="principle__title h2 animate-title">{{ principleTitle }}</h2>
          <p class="principle__description p2 animate-opacity">{{ principleDescription }}</p>
          <div class="principle__list">
            <div
                class="principle__item animate-opacity"
                v-for="(item, index) in principleList"
                :key="index"
            >
              <div class="principle__item__inner">
                <div
                    class="principle__item__icon"
                    :ref="el => lottieRefs[index] = el as HTMLElement"
                ></div>
                <h3 class="principle__item__title h3">{{ item.title }}</h3>
              </div>
              <p class="principle__item__description p2">{{ item.description }}</p>
            </div>
          </div>
          <div class="principle__button animate-opacity">
            <ui-button
                :href="buttonFormHref"
                :title="buttonFormTitle"
                :option="buttonFormOption"
            />
          </div>
        </div>
        <div class="direction" ref="blockDirectionRef">
          <h2 class="direction__title h2">{{ directionTitle }} ({{ directionList.length }})</h2>
          <div class="direction__list">
            <div
                class="direction__item animate-opacity"
                v-for="(item, index) in directionList" :key="index"
            >
              <div class="direction__item__sub-title p2">{{ item.sub_title }}</div>
              <h3 class="direction__item__title h3">{{ item.title }}</h3>
            </div>
          </div>
        </div>
        <div class="partner" ref="blockPartnerRef">
          <h2 class="partner__title h2 animate-title">{{ partnerTitle }}</h2>
          <div class="partner__list__inner">
            <div class="partner__list">
              <div class="partner__item" v-for="(item, index) in partnerList" :key="index">
                <img :src="partnerImageUrls[index]" alt="" class="partner__item__image" loading="lazy">
                <p class="partner__item__description p2">{{ item.description }}</p>
              </div>
            </div>
            <div class="partner__list">
              <div class="partner__item" v-for="(item, index) in partnerList" :key="index">
                <img :src="partnerImageUrls[index]" alt="" class="partner__item__image" loading="lazy">
                <p class="partner__item__description p2">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="projects" ref="blockProjectsRef">
          <h2 class="projects__title h2 animate-title">{{ projectTitle }}</h2>
          <div class="projects__list">
            <div class="projects__list">
              <div
                  class="projects__item animate-opacity"
                  v-for="(item, index) in visibleProjects"
                  :key="index"
              >
                <div class="projects__item__title">
                  <img :src="item.imageUrl" class="projects__item__title__image" loading="lazy" />
                  <p class="h3">{{ item.title }}</p>
                </div>
                <div class="projects__item__inner">
                  <div class="projects__item__description p2">{{ item.description }}</div>
                  <button
                      class="projects__item__button button-underline"
                      @click="openPopup(item)"
                  >
                  <span class="button-underline__inner p2">
                    <span class="button-underline__title">Подробнее</span>
                    <span class="button-underline__title">Подробнее</span>
                  </span>
                  </button>
                </div>
              </div>

            </div>
          </div>
          <button
              class="button-ui button-ui_bg-red"
              @click="loadNextProjects"
              v-if="visibleProjects.length < allProjects.length"
          >
          <span class="button-ui__inner p2">
            <span class="button-ui__title">Загрузить ещё</span>
            <span class="button-ui__title">Загрузить ещё</span>
          </span>
          </button>
        </div>
        <div class="form grid-12">
          <div class="anchor" id="tell-us"></div>
          <div class="form__inner">
            <div class="form__title h2">{{ formTitle }}</div>
            <div class="form__description p2">{{ formDescription }}</div>
          </div>
          <div class="form__content">
            <div class="form__content__list">
              <input v-model="name" :class="['input p2', { error: errors.name }]" placeholder="Ваше имя*" required />
              <input v-model="email" :class="['input p2', { error: errors.email }]" placeholder="Email*" required />
              <input v-model="phone" :class="['input p2', { error: errors.phone }]" placeholder="Ваш номер телефона*" required />
              <textarea v-model="message" class="input p2" placeholder="Сообщение"></textarea>
            </div>
            <div class="form__content__privacy p2">
              Отправляя заявку вы соглашаетесь на обработку <a href="#" class="p2">персональных данных.</a>
            </div>
            <button class="button-ui button-ui_bg-red" @click.prevent="submitForm">
      <span class="button-ui__inner p2">
        <span class="button-ui__title">Отправить</span>
        <span class="button-ui__title">Отправить</span>
      </span>
            </button>
            <p v-if="statusMessage" :class="{'success': statusSuccess, 'error': !statusSuccess}" class="p2 message">
              {{ statusMessage }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <PopupProject
      v-if="isPopupOpen"
      :project="selectedProject"
      @close="closePopup"
  />
</template>

<style scoped>
.main-image-3{
  position: absolute;
  top: 40rem;
  right: 0;
  width: 70rem;
  height: 52.5rem;
  background-image: url('@/assets/images/box3.png');
  background-repeat: no-repeat;
  background-position: right;
  background-size: contain;
  mix-blend-mode: multiply;
  opacity: 1;
  z-index: 0;
}
</style>