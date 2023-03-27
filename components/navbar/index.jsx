import React, { useState } from 'react'
import Link from 'next/link'
import { Profile } from '../../data'

function NavBar() {
    const [menuIsOpen, setMenuIsOpen] = useState(false)

    const toggleMenu = () => setMenuIsOpen((prev) => !prev)

    const navbarMenuClassNames = ['navbar-menu', menuIsOpen ? 'open' : 'closed'].join(' ')

    return (
        <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <Link
                    href="/"
                    className="navbar-item has-text-weight-bold"
                    aria-label={Profile.name}
                >
                    <img src="/images/logo.png" height={28} width={28} alt={Profile.name} />
                </Link>

                <a
                    role="button"
                    className="navbar-burger"
                    aria-label="menu"
                    aria-expanded="false"
                    data-target="navbarMenu"
                    onClick={toggleMenu}
                >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarMenu" className={navbarMenuClassNames}>
                <div className="navbar-start">
                    <Link href="/" className="navbar-item">
                        Home
                    </Link>

                    <Link href="/projects" className="navbar-item">
                        Projects
                    </Link>
                </div>
            </div>
        </nav>
    )
}

NavBar.propTypes = {}

export default NavBar
