import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SplitText from 'gsap/SplitText'
import { ref } from 'vue'

gsap.registerPlugin(ScrollTrigger, SplitText)

export const isPreloaderDone = ref(false)

export function useAnimations() {
  /**
   * Универсальная анимация текста с построчным появлением
   * с привязкой к появлению в области видимости
   */
  const blockAnimation = async (
      container: HTMLElement | null,
      selector = '.animate-title',
      timeline?: gsap.core.Timeline
  ): Promise<void> => {
    return new Promise((resolve) => {
      if (!container) return resolve()

      const elements = container.querySelectorAll(selector)
      if (!elements.length) return resolve()

      const animationData = Array.from(elements).map(element => {
        const allLines: HTMLElement[] = []

        if (element.querySelector('span')) {
          gsap.utils.toArray<HTMLElement>(element.querySelectorAll('span')).forEach((el) => {
            const split = new SplitText(el, {
              type: 'lines',
              linesClass: 'line-temp'
            })

            split.lines.forEach((line) => {
              const span = document.createElement('span')
              span.className = 'line'
              span.style.display = 'block'
              span.innerHTML = line.innerHTML
              line.replaceWith(span)
              allLines.push(span)
            })
          })
        } else {
          const split = new SplitText(element, {
            type: 'lines',
            linesClass: 'line-temp'
          })

          split.lines.forEach((line) => {
            const span = document.createElement('span')
            span.className = 'line'
            span.style.display = 'block'
            span.innerHTML = line.innerHTML
            line.replaceWith(span)
            allLines.push(span)
          })
        }

        gsap.set(allLines, {
          opacity: 0,
          y: 100
        })

        return { element, allLines }
      })

      let completedAnimations = 0
      const totalElements = animationData.length

      animationData.forEach(({ element, allLines }) => {
        ScrollTrigger.create({
          trigger: element,
          start: "top 90%",
          onEnter: () => {
            const elementTl = timeline ?? gsap.timeline()
            elementTl.to(allLines, {
              duration: 0.5,
              opacity: 1,
              y: 0,
              ease: 'linear',
              stagger: 0.15,
            })

            elementTl.call(() => {
              completedAnimations++
              if (completedAnimations === totalElements) {
                resolve()
              }
            })
          },
          once: true
        })
      })
    })
  }

  /**
   * Fade-in анимация с привязкой к появлению в области видимости
   */
  const fadeInAnimation = (
      container: HTMLElement | null,
      selector = '.animate-opacity',
      timeline?: gsap.core.Timeline
  ) => {
    if (!container) return timeline ?? gsap.timeline()

    const elements = gsap.utils.toArray<HTMLElement>(container.querySelectorAll(selector))
    gsap.set(elements, { opacity: 0, y: 5 })

    const masterTl = timeline ?? gsap.timeline()

    elements.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        onEnter: () => {
          const elementTl = gsap.timeline()
          elementTl.to(el, {
            duration: 0.3,
            opacity: 1,
            y: 0,
            ease: 'linear'
          })
          masterTl.add(elementTl, '+=0.1')
        },
        once: true
      })
    })

    return masterTl
  }

  /**
   * Анимация по направлению скролла:
   * элементы приподнимаются при скролле вниз
   * и опускаются при скролле вверх
   */
  const scrollDirectionShiftAnimation = (
      container: HTMLElement | null,
      selector = '.animate-shift',
      amount = 200
  ) => {
    if (!container) return

    // Добавим стили на случай, если контейнер еще не скроллится
    if (getComputedStyle(container).overflowY === 'visible') {
      container.style.overflowY = 'auto'
    }
    if (!container.style.height) {
      container.style.height = '100vh' // или задайте вручную нужную высоту
    }

    const elements = gsap.utils.toArray<HTMLElement>(container.querySelectorAll(selector))

    elements.forEach(el => {
      gsap.fromTo(
          el,
          { y: 0 },
          {
            y: -amount,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              scroller: container, // используем контейнер как область скролла
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            }
          }
      )
    })
  }




  return {
    blockAnimation,
    fadeInAnimation,
    scrollDirectionShiftAnimation,
  }
}