import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function prideScrollAnimation(container) {
    if (!container) return

    const list = container.querySelector('.pride__list')
    if (!list) return


    gsap.set(list, { xPercent:  50})

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: 'bottom bottom',
            end: '+=6000',
            scrub: true,
            pin: true,
            markers: false,
            pinSpacing: true,
        },
    })

    tl.fromTo(list, { xPercent: 50 }, { xPercent: -110.5, ease: 'none' })
}
