const { expect } = require('@playwright/test')

export class Login {
  constructor(page) {
    this.page = page
  }

  async do(payload) {
    await this.visit()
    await this.submit(payload)
    await this.isLoggedIn(payload)
  }

  async visit() {
    await this.page.goto('/admin/login')

    const loginForm = this.page.locator('.login-form')

    await expect(loginForm).toBeVisible()
  }

  async submit(payload) {
    await this.page.getByPlaceholder('E-mail').fill(payload.email)
    await this.page.getByPlaceholder('Senha').fill(payload.senha)
    await this.page.getByText('Entrar').click()
  }

  async alertHaveText(message) {
    const alert = this.page.locator('span[class*=alert]')
    await expect(alert).toHaveText(message)
  }

  async isLoggedIn(payload) {
    const loggetUser = this.page.locator('.logged-user')

    await expect(loggetUser).toHaveText(`Olá, ${payload.userName}`)
  }
}
