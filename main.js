const nav = document.querySelector('#heady nav')
const toggle = document.querySelectorAll('nav .toggle')

for (const element of toggle) {
  element.addEventListener('click', function () {
    nav.classList.toggle('show')
  })
}

/*quando clicar em um titulo do menu, esconder o menu*/
const links = document.querySelectorAll('nav ul li a')

for (const link of links) {
  link.addEventListener('click', function () {
    nav.classList.remove('show')
  })
}

/* mudar o header da pagina quando der scroll */
const header = document.querySelector('#header')
const navheight = header.offsetheight

function changeHeaderWhenScroll() {
  if (window.scrollY >= navheight) {
    // scroll e maior que a altura do header
    header.classList.add('scroll')
  } else {
    //menor que a altura do header
    header.classList.remove('scroll')
  }
}

/*TESTIMONIALS CAROUSEL SLIDER SWIPER*/
const SWIPER = new Swiper('.swiper-container', {
  sliderPerView: 1,
  pagination: {
    el: '.swiper-pagination'
  },
  mousewheel: true,
  Keyboard: true,
  breakpoints: {
    767: {
      sliderPerView: 2,
      setWrapperSize: true
    }
  }
})

/*ScrollReveal*/
const ScrollReveal = ScrollReveal({
  origin: 'Top',
  distance: '30px',
  duration: 700,
  reset: true
})

ScrollReveal.reveal(
  `#home .image, #home .text 
  #about .image, #about .text,
  #services heades, #services .card,
  #testimonials header, #testimonials.testimonials
  #contact .text, #contact .links,
  footer .brand, footer .social
  `,
  { interval: 10 }
)

/*botam voltar para o topo*/

function backToTop() {
  const backToTopButton = document.querySelector('.back-to-top')
  if (window.scroll >= 560) {
    backToTopButton.classList.add('show')
  } else {
    backToTopButton.classList.remove('show')
  }
}

/* Menu ativo na pagina*/
const sections = document.querySelector('main section[id]')
function activateMenuAtCurrentSection() {
  const checkpoint = window.pageYOffset + (window.innerHeight / 8) * 4

  for (const section of sections) {
    const sectiontop = section.offsetTop
    const sectionHeight = section.offsetheight
    const sectionId = section.getAttribute('id')
  }
}

/*when scrool*/
window.addEventListener('scroll', function () {
  changeHeaderWhenScroll()
  backToTop()
})
