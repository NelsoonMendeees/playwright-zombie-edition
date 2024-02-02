const { test, expect } = require('../support')

const data = require('../support/fixtures/tvshows.json')
const { executeSQL } = require('../support/database')

export const payload = {
  email: 'admin@zombieplus.com',
  senha: 'pwd123',
  userName: 'Admin'
}

test.beforeAll(async () => {
  await executeSQL(`DELETE from tvshows`)
})

test('deve cadastrar uma nova serie', async ({ page }) => {
  const serie = data.create

  await page.login.do(payload)
  await page.tvshows.create(serie)
  await page.popup.haveText(`A série '${serie.title}' foi adicionada ao catálogo.`)
})

test('deve remover uma serie', async ({ page, request }) => {
  const serie = data.remove

  await request.api.postSerie(serie)

  await page.login.do(payload)

  await page.tvshows.goTvshow()

  await page.tvshows.remove(serie.title)

  await page.popup.haveText('Série removida com sucesso.')
})

test('não deve cadastrar titulo duplicado', async ({ page, request }) => {
  const serie = data.duplicate

  await request.api.postSerie(serie)

  await page.login.do(payload)
  await page.tvshows.create(serie)
  await page.popup.haveText(`O título '${serie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)
})

test('não deve cadastrar quando os campos obrigatórios não são preenchidos', async ({ page }) => {
  await page.login.do(payload)

  await page.tvshows.goTvshow()
  await page.tvshows.goForm()
  await page.tvshows.submit()
  await page.tvshows.alertHaveText(['Campo obrigatório', 'Campo obrigatório', 'Campo obrigatório', 'Campo obrigatório', 'Campo obrigatório (apenas números)'])
})

test('deve realizar busca pelo termo zumbi', async ({ page, request }) => {
  const tvshow = data.search

  tvshow.data.forEach(async (m) => {
    await request.api.postSerie(m)
  })

  await page.login.do(payload)

  await page.tvshows.goTvshow()

  await page.tvshows.search(tvshow.input)

  await page.tvshows.tableHave(tvshow.outputs)
})
