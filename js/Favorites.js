export class GithubUser {
    static search(username) {
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint)
            .then(data => data.json())
            .then(data => ({
                login: data.login,
                name: data.name,
                public_repos: data.public_repos,
                followers: data.followers
            }))
    }
}

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        const entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
        this.entries = []

    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username)

            if (userExists) {
                throw new Error('User already registered')
            }

            const user = await GithubUser.search(username)

            if (user.login === undefined) {
                throw new Error('User not found')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch (error) {
            alert(error.message)
        }
    }

    delete(user) {
        this.entries = this.entries.filter((entry) => entry.login !== user.login)

        this.update()
        this.save()
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')


        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    update() {
        this.removeAllTr()

        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Image of ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Are you sure you want to delete this line?')
                if (isOk) {
                    this.delete(user)
                }

            }


            this.tbody.append(row)
        })

    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
                    <td class="user">
                    <img src="https://github.com/paulakoppe.png" alt="">
                    <a href="https://github.com/paulakoppe" target="_blank">
                        <p>Paula Koppe</p>
                        <span>paulakoppe</span>
                    </a>
                </td>
                <td class="followers">
                    9
                </td>
                <td class="repositories">
                    16
                </td>
                <td>
                    <button class="remove">&times;</button>
                </td>
                `

        return tr
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
                tr.remove()
            })
    }
}








































