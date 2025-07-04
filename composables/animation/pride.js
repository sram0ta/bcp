import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function prideScrollAnimation(container) {
    if (!container) return

    const list = container.querySelector('.pride__list')
    if (!list) return

    const containerWidth = container.offsetWidth
    const listWidth = list.scrollWidth

    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)

    const isMobile = window.innerWidth < 768
    const isLaptop = window.innerWidth < 1366
    // const offsetPx = rem * (isLaptop ? 1 : .5)

    const startX = isMobile ? 0 : (containerWidth / 2)

    const lastItem = list.lastElementChild
    const lastItemWidth = lastItem?.offsetWidth || 0

    const endX = -(listWidth - containerWidth / 2 - lastItemWidth / 2 - startX / 2)

    gsap.set(list, { x: startX })

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: 'bottom bottom',
            end: `+=${listWidth}`,
            scrub: true,
            pin: true,
            pinSpacing: true,
            markers: false,
        },
    })

    tl.to(list, {
        x: endX,
        ease: 'none',
    })
}
