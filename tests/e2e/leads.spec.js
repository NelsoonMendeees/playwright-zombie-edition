const { test, expect } = require('../support')
const { faker } = require('@faker-js/faker')
const { executeSQL } = require('../support/database')

// test.beforeAll(async () => {
//   leadName = faker.person.fullName()
//   leadEmail = faker.internet.email()
// })

// test('Deve cadastrar um lead na fila de espera', async ({ page }) => {
//   await page.goto('http://localhost:3000/')

//   //Localiza via xpath
//   // await page.click('//button[text()="Aperte o play... se tiver coragem"]');

//   //Combina tag html com o texto / / faz o papel de contains
//   await page.getByRole('button', { name: /Aperte o play/ }).click()

//   // Realiza a validação do elemento na tela
//   await expect(page.getByTestId('modal').getByRole('heading')).toHaveText('Fila de espera')

//   // Identificando via id - locator é generico
//   // await page.locator('#name').fill('nelson.mds@qa.com')

//   // identifica via name
//   // await page.locator('input[name=name]').fill('nelson.mds@qa.com')

//   // identifica via placeholder
//   await page.getByPlaceholder('Informe seu nome').fill('Nelson Mendes')

//   await page.getByPlaceholder('Informe seu email').fill('nelson.mds@qa.com')

//   await page.getByTestId('modal').getByText('Quero entrar na fila!').click()

//   await expect(page.locator('.toast')).toHaveText('Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!')

//   await expect(page.locator('.toast')).toBeHidden({ timeout: 5000 })
// })

test.beforeAll(async () => {
  await executeSQL(`DELETE from leads`)
})

test('Deve cadastrar um lead na fila de espera', async ({ page }) => {
  const payload = {
    name: faker.person.fullName(),
    email: 'user.test@qa.com.br',
    message: 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato.'
  }

  await page.leads.visit()

  await page.leads.openLeadModal()

  await page.leads.submitLeadForm(payload)

  await page.popup.haveText(payload.message)
})

test('Não deve cadastrar email duplicado', async ({ page, request }) => {
  const payload = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    message: 'Verificamos que o endereço de e-mail fornecido já consta em nossa lista de espera. Isso significa que você está um passo mais perto de aproveitar nossos serviços.'
  }

  const newLead = await request.post('http://localhost:3333/leads', { data: { name: payload.name, email: payload.email } })

  expect(newLead.ok()).toBeTruthy()

  await page.leads.visit()

  await page.leads.openLeadModal()

  await page.leads.submitLeadForm(payload)

  await page.popup.haveText(payload.message)
})

test('Não deve cadastrar com email incorreto', async ({ page }) => {
  const payload = {
    name: 'Nelson Mendes',
    email: 'nelson.mendesqa.com.br',
    target: 'Email incorreto'
  }

  await page.leads.visit()

  await page.leads.openLeadModal()

  await page.leads.submitLeadForm(payload)

  await page.leads.alertHaveText(payload.target)
})

test('Não deve cadastrar quando nome não é informado', async ({ page }) => {
  const payload = {
    name: '',
    email: 'nelson.mendes@qa.com.br',
    target: 'Campo obrigatório'
  }

  await page.leads.visit()

  await page.leads.openLeadModal()

  await page.leads.submitLeadForm(payload)

  await page.leads.alertHaveText(payload.target)
})

test('Não deve cadastrar quando o email não é informado', async ({ page }) => {
  const payload = {
    name: 'Nelson Mendes',
    email: '',
    target: 'Campo obrigatório'
  }

  await page.leads.visit()

  await page.leads.openLeadModal()

  await page.leads.submitLeadForm(payload)

  await page.leads.alertHaveText(payload.target)
})

test('Não deve cadastrar quando nenhum campo é preenchido', async ({ page }) => {
  const payload = {
    name: '',
    email: '',
    target: 'Campo obrigatório'
  }

  await page.leads.visit()

  await page.leads.openLeadModal()

  await page.leads.submitLeadForm(payload)

  await page.leads.alertHaveText([payload.target, payload.target])
})
