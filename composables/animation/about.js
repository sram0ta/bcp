import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function aboutAnimation(titleElement) {

    if (!titleElement) return;

    const text = titleElement.textContent

    if (!text) return

    const words = text.split(/(\s+)/)


    titleElement.innerHTML = words
        .map(word => {
            if (word.trim() === '') {
                return word.replace(/\s/g, '&nbsp;')
            }

            const letters = word.split('')
            const lettersHTML = letters
                .map(letter => `<span class="letter">${letter === ' ' ? '&nbsp;' : letter}</span>`)
                .join('')
            return `<span class="word">${lettersHTML}</span>`
        })
        .join('')

    const chars = titleElement.querySelectorAll('.letter')

    gsap.set(chars, {
        color: '#F2F2F233',
    })

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.about',
            start: 'top bottom',
            end: 'center center',
            scrub: true,
            pin: false,
            markers: true,
        },
    })

    tl.to(chars, {
        color: '#F2F2F2',
        stagger: 0.05,
        duration: 0.1,
    })
}

