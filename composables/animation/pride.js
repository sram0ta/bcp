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

    const isLaptop = window.innerWidth < 1366
    const offsetPx = rem * (isLaptop ? 1 : 1.5)

    const startX = (containerWidth / 2)

    const endX = -(listWidth - containerWidth + offsetPx)

    gsap.set(list, { x: startX })

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: 'top top',
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
