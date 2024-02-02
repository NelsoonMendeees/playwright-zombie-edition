const { test, expect } = require('../support')

const data = require('../support/fixtures/movies.json')
const { executeSQL } = require('../support/database')

export const payload = {
  email: 'admin@zombieplus.com',
  senha: 'pwd123',
  userName: 'Admin'
}

test.beforeAll(async () => {
  await executeSQL(`DELETE from movies`)
})

test('deve cadastrar um novo filme', async ({ page }) => {
  const movie = data.create

  await page.login.do(payload)
  await page.movies.create(movie)
  await page.popup.haveText(`O filme '${movie.title}' foi adicionado ao catálogo.`)
})

test('deve remover um filme', async ({ page, request }) => {
  const movie = data.remove

  await request.api.postMovie(movie)

  await page.login.do(payload)

  await page.movies.remove(movie.title)

  await page.popup.haveText('Filme removido com sucesso.')
})

test('não deve cadastrar titulo duplicado', async ({ page, request }) => {
  const movie = data.duplicate

  await request.api.postMovie(movie)

  await page.login.do(payload)
  await page.movies.create(movie)
  await page.popup.haveText(`O título '${movie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)
})

test('não deve cadastrar quando os campos obrigatórios não são preenchidos', async ({ page }) => {
  await page.login.do(payload)

  await page.movies.goForm()
  await page.movies.submit()
  await page.movies.alertHaveText(['Campo obrigatório', 'Campo obrigatório', 'Campo obrigatório', 'Campo obrigatório'])
})

test('deve realizar busca pelo termo zumbi', async ({ page, request }) => {
  const movies = data.search

  movies.data.forEach(async (m) => {
    await request.api.postMovie(m)
  })

  await page.login.do(payload)

  await page.movies.search(movies.input)

  await page.movies.tableHave(movies.outputs)
})