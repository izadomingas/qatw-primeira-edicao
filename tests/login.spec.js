import { test, expect } from '@playwright/test';

import { obterCodigo2FA } from '../support/db';

import { LoginPage } from '../pages/LoginPage';

import { DashPage } from '../pages/DashPage';

test('Não deve logar quando o código de autenticacão é inválido', async ({ page }) => {
  const loginPage = new LoginPage(page)

  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }
  
  await loginPage.acessaPagina()
  await loginPage.informaCpf(usuario.cpf)
  await loginPage.informaSenha(usuario.senha)
  await loginPage.informe2FA('123456')

  await expect(page.locator('span')).toContainText('Código inválido. Por favor, tente novamente.');
});

test('Deve acessar a conta do usuário', async ({ page }) => {

  const loginPage = new LoginPage(page)
  const dashPage = new DashPage(page)
  
  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }
  
  await loginPage.acessaPagina()
  await loginPage.informaCpf(usuario.cpf)
  await loginPage.informaSenha(usuario.senha)

  // temporário
  await page.waitForTimeout(3000)
  const codigo = await obterCodigo2FA()

  await loginPage.informe2FA(codigo)

  // temporário
  await page.waitForTimeout(2000)

  expect(await dashPage.obterSaldo()).toHaveText('R$ 5.000,00')
  
});