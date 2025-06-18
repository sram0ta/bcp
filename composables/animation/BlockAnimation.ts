import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SplitText from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

export function BlockAnimation(selector = '.animate-title') {
  const title = document.querySelector(selector)
  if (!title) return

  const startPos = window.matchMedia('(min-width: 1024px)').matches ? 'top 85%' : 'top 95%'

  const allLines: HTMLElement[] = []

  gsap.utils.toArray<HTMLElement>(title.querySelectorAll('span')).forEach((el) => {
    const split = new SplitText(el, {
      type: 'lines',
      linesClass: 'line-temp'
    })

    split.lines.forEach((line) => {
      if (line instanceof HTMLDivElement) {
        const span = document.createElement('span')
        span.className = 'line'
        span.style.display = 'block'
        span.innerHTML = line.innerHTML
        line.replaceWith(span)
        allLines.push(span)
      } else {
        allLines.push(line as HTMLElement)
      }
    })
  })

  requestAnimationFrame(() => {
    gsap.from(allLines, {
      scrollTrigger: {
        trigger: title,
        start: startPos,
      },
      duration: 0.4,
      opacity: 0,
      y: 100,
      ease: 'power3.out',
      stagger: 0.1,
    })
  })
}
