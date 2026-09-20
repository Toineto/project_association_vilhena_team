/*  abre e fecha o menu quando clicar no icone: hamburguer e x */
const nav = document.querySelector('#header nav')
const toggle = document.querySelectorAll('nav .toggle')
const links = document.querySelectorAll('nav ul li a')

if (nav) {
  for (const element of toggle) {
    element.addEventListener('click', function () {
      nav.classList.toggle('show')
    })
    element.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        nav.classList.toggle('show')
      }
    })
  }

  /* quando clicar em um item do menu, esconder o menu */
  for (const link of links) {
    link.addEventListener('click', function () {
      nav.classList.remove('show')
    })
  }
}

/* mudar o header da página quando der scroll */
const header = document.querySelector('#header')
const navHeight = header ? header.offsetHeight : 72

function changeHeaderWhenScroll() {
  if (!header) return
  if (window.scrollY >= navHeight) {
    // scroll é maior que a altura do header
    header.classList.add('scroll')
  } else {
    // menor que a altura do header
    header.classList.remove('scroll')
  }
}

/* ScrollReveal: Mostrar elementos quando der scroll na página */
if (typeof ScrollReveal !== 'undefined') {
  const scrollReveal = ScrollReveal({
    origin: 'top',
    distance: '30px',
    duration: 700,
    reset: true
  })

  scrollReveal.reveal(
    `#home .image, #home .text,
    #about .image, #about .text,
    #founder .image, #founder .text,
    #kids .image, #kids .text,
    #mission header, #mission .card,
    #Instructors header, #Instructors .professores__conteudo,
    #filiais header, #filiais .card,
    #contact .text, #contact .links,
    footer .brand, footer .social
    `,
    { interval: 100 }
  )
}

/* Botão voltar para o topo */
const backToTopButton = document.querySelector('.back-to-top')

function backToTop() {
  if (!backToTopButton) return
  if (window.scrollY >= 560) {
    backToTopButton.classList.add('show')
  } else {
    backToTopButton.classList.remove('show')
  }
}

/* Menu ativo conforme a seção visível na página */
const sectionNavMapping = {
  home: 'home',
  about: 'about',
  founder: 'about',
  kids: 'about',
  mission: 'mission',
  Instructors: 'Instructors',
  instructors: 'Instructors',
  filiais: 'filiais',
  contact: 'contact'
}

function findNavLink(targetId) {
  if (!targetId) return null
  const exact = document.querySelector(`nav ul li a[href="#${targetId}"]`)
  if (exact) return exact

  // Busca insensível a maiúsculas/minúsculas
  const allLinks = document.querySelectorAll('nav ul li a')
  for (const link of allLinks) {
    const href = link.getAttribute('href') || ''
    if (href.startsWith('#') && href.substring(1).toLowerCase() === targetId.toLowerCase()) {
      return link
    }
  }
  return null
}

function activateMenuAtCurrentSection() {
  const sections = Array.from(document.querySelectorAll('main section[id]'))
  if (!sections.length) return

  const navLinks = document.querySelectorAll('nav ul li a')
  const scrollY = window.scrollY || window.pageYOffset || 0
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight
  const documentHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight
  )

  let activeNavId = null

  // 1. Se estiver no topo da página
  if (scrollY < 80) {
    activeNavId = 'home'
  }
  // 2. Se estiver no final da página (rodapé / contatos)
  else if (scrollY + viewportHeight >= documentHeight - 80) {
    activeNavId = 'contact'
  }
  // 3. Verifica em qual seção o ponto de foco da tela está
  else {
    const checkpoint = scrollY + (header ? header.offsetHeight : 72) + 120

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i]
      const sectionTop = section.getBoundingClientRect().top + scrollY
      if (checkpoint >= sectionTop) {
        const sectionId = section.getAttribute('id')
        activeNavId = sectionNavMapping[sectionId] || sectionId
        break
      }
    }

    if (!activeNavId) {
      activeNavId = 'home'
    }
  }

  // Atualiza classes ativas nos links do menu
  navLinks.forEach(link => link.classList.remove('active'))

  const currentLink = findNavLink(activeNavId)
  if (currentLink) {
    currentLink.classList.add('active')
  }
}

function initScrollState() {
  changeHeaderWhenScroll()
  backToTop()
  activateMenuAtCurrentSection()
}

/* When Scroll */
window.addEventListener('scroll', function () {
  changeHeaderWhenScroll()
  backToTop()
  activateMenuAtCurrentSection()
})

/* Executar na inicialização da página */
window.addEventListener('load', initScrollState)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollState)
} else {
  initScrollState()
}
