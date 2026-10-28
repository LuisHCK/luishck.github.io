const burger = document.querySelector('.navbar-burger')

if (burger) {
    const target = burger.getAttribute('data-target')
    const menu = target ? document.getElementById(target) : null

    const setOpen = (isOpen, { focus = false } = {}) => {
        menu.classList.toggle('open', isOpen)
        menu.classList.toggle('closed', !isOpen)
        burger.setAttribute('aria-expanded', String(isOpen))

        if (focus && isOpen) {
            menu.querySelector('a')?.focus()
        }

        if (!isOpen) {
            burger.focus()
        }
    }

    if (menu) {
        burger.addEventListener('click', () => {
            setOpen(!menu.classList.contains('open'), { focus: true })
        })

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && menu.classList.contains('open')) {
                setOpen(false)
            }
        })
    }
}
