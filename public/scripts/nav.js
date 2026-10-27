const burger = document.querySelector('.navbar-burger')

if (burger) {
    burger.addEventListener('click', () => {
        const target = burger.getAttribute('data-target')
        const menu = target ? document.getElementById(target) : null

        if (!menu) return

        const isOpen = menu.classList.toggle('open')
        menu.classList.toggle('closed', !isOpen)
        burger.setAttribute('aria-expanded', String(isOpen))
    })
}
