const toCurrency = price => {
    return new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency',
    }).format(price)
}

const toDate = date => {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(new Date(date))
}

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
})

document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent)
})

const $cart = document.querySelector('#cart')
if ($cart) {
    $cart.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id
            const csurf = event.target.dataset.csurf

            fetch(`/cart/remove/${id}`, {
                method: 'delete',
                headers: {
                    'X-XSRF-TOKEN': csurf,
                },
            })
                .then(res => res.json())
                .then(cart => {
                    if (cart.products.length) {
                        const html = cart.products
                            .map(
                                c => `
                                <tr>
                                    <td>${c.title}</td>
                                    <td>${c.count}</td>
                                    <td>
                                        <button class="btn btn-danger js-remove" data-csurf="${csurf}" data-id="${c.id}">Удалить</button>
                                    </td>
                                </tr>
                                `
                            )
                            .join('')
                        $cart.querySelector('tbody').innerHTML = html
                        $cart.querySelector('.price').textContent = toCurrency(
                            cart.price
                        )
                    } else {
                        $cart.innerHTML = '<p class="lead">Корзина пуста</p>'
                    }
                })
        }
    })
}
