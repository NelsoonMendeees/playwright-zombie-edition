const { test } = require('../support')
const data = require('../support/fixtures/users.json')

test('Deve logar como administrador', async ({ page }) => {
  const payload = data.success

  await page.login.do(payload)
})

test('Não deve logar com senha incorreta', async ({ page }) => {
  const payload = data.invalidPass

  await page.login.visit()
  await page.login.submit(payload)
  await page.popup.haveText(payload.message)
})

test('Não deve logar com email inválido', async ({ page }) => {
  const payload = data.invalidEmail

  await page.login.visit()
  await page.login.submit(payload)
  await page.login.alertHaveText(payload.message)
})

test('Não deve logar quando o email não é preenchido', async ({ page }) => {
  const payload = data.emailNull

  await page.login.visit()
  await page.login.submit(payload)
  await page.login.alertHaveText(payload.message)
})

test('Não deve logar quando a senha não é preenchido', async ({ page }) => {
  const payload = data.passwordNull

  await page.login.visit()
  await page.login.submit(payload)
  await page.login.alertHaveText(payload.message)
})

test('Não deve logar quando nenhum campo é preenchido', async ({ page }) => {
  const payload = data.dataNull

  await page.login.visit()
  await page.login.submit(payload)
  await page.login.alertHaveText([payload.message, payload.message])
})
