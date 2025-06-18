import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SplitText from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

/**
 * Анимация заголовков с построчным появлением
 */
export function BlockAnimation(selector = '.animate-title', timeline?: gsap.core.Timeline): Promise<void> {
  return new Promise((resolve) => {
    const title = document.querySelector(selector)
    if (!title) return resolve()

    const allLines: HTMLElement[] = []

    gsap.utils.toArray<HTMLElement>(title.querySelectorAll('span')).forEach((el) => {
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

    // Если передан timeline — добавляем туда, иначе обычная анимация
    const tl = timeline ?? gsap.timeline()

    tl.from(allLines, {
      duration: .5,
      opacity: 0,
      y: 100,
      ease: 'linear',
      stagger: 0.15,
    })

    tl.call(() => resolve())
  })
}

/**
 * Fade-in анимация для остальных блоков
 */
export function FadeInAnimation(selector = '.animate-opacity', timeline?: gsap.core.Timeline) {
  const elements = gsap.utils.toArray<HTMLElement>(selector)

  const tl = timeline ?? gsap.timeline()

  // Установим стартовое состояние
  gsap.set(elements, { opacity: 0, y: 5 })

  // Анимация к видимому состоянию
  elements.forEach((el) => {
    tl.to(el, {
      duration: 0.3,
      opacity: 1,
      y: 0,
      ease: 'linear',
    }, '+=0.1')
  })

  return tl
}
