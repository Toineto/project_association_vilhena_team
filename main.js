/*  abre e fecha o menu quando clicar no icone: hamburguer e x */
const nav = document.querySelector('#header nav')
const toggle = document.querySelectorAll('nav .toggle')

for (const element of toggle) {
  element.addEventListener('click', function () {
    nav.classList.toggle('show')
  })
}

/* quando clicar em um item do menu, esconder o menu */
const links = document.querySelectorAll('nav ul li a')

for (const link of links) {
  link.addEventListener('click', function () {
    nav.classList.remove('show')
  })
}

/* mudar o header da página quando der scroll */
const header = document.querySelector('#header')
const navHeight = header.offsetHeight

function changeHeaderWhenScroll() {
  if (window.scrollY >= navHeight) {
    // scroll é maior que a altura do header
    header.classList.add('scroll')
  } else {
    // menor que a altura do header
    header.classList.remove('scroll')
  }
}

/* ScrollReveal: Mostrar elementos quando der scroll na página */
const scrollReveal = ScrollReveal({
  origin: 'top',
  distance: '30px',
  duration: 700,
  reset: true
})

scrollReveal.reveal(
  `#home .image, #home .text,
  #about .image, #about .text,
  #services header, #services .card,
  #testimonials header, #testimonials .testimonials
  #contact .text, #contact .links,
  footer .brand, footer .social
  `,
  { interval: 100 }
)

/* Botão voltar para o topo */
const backToTopButton = document.querySelector('.back-to-top')

function backToTop() {
  if (window.scrollY >= 560) {
    backToTopButton.classList.add('show')
  } else {
    backToTopButton.classList.remove('show')
  }
}

/* Menu ativo conforme a seção visível na página */
const sections = document.querySelectorAll('main section[id]')
function activateMenuAtCurrentSection() {
  const scrollPosition = window.scrollY + 200

  // Remove active de todos os links
  document.querySelectorAll('nav ul li a').forEach(link => {
    link.classList.remove('active')
  })

  let currentSection = null

  for (const section of sections) {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute('id')
    const sectionBottom = sectionTop + sectionHeight

    // Verifica se o scroll está dentro da seção
    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      currentSection = sectionId
      break
    }
  }

  // Se não encontrou seção, marca a última seção se estiver no fim da página
  if (!currentSection && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 500) {
    const lastSection = sections[sections.length - 1]
    if (lastSection) {
      currentSection = lastSection.getAttribute('id')
    }
  }

  // Adiciona active ao link correspondente
  if (currentSection) {
    const activeLink = document.querySelector('nav ul li a[href="#' + currentSection + '"]')
    if (activeLink) {
      activeLink.classList.add('active')
    }
  }
}

/* When Scroll */
window.addEventListener('scroll', function () {
  changeHeaderWhenScroll()
  backToTop()
  activateMenuAtCurrentSection()
})
