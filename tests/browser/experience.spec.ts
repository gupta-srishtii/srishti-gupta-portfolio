import { test, expect } from '@playwright/test';
test('sketchbook, gallery, recruiter access, and quiet edition', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Skip intro' }).click();
  await expect(page.locator('canvas')).toBeVisible();
  await page.waitForTimeout(2400);
  await page.screenshot({ path: `test-results/${info.project.name}-atelier.png` });
  await page.getByRole('button', { name: 'Open the sketchbook' }).click();
  await expect(page.getByRole('heading', { name: 'An inventor’s sketchbook' })).toBeVisible();
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `test-results/${info.project.name}-book.png` });
  await page.getByRole('button', { name: 'Next page' }).click();
  await expect(page.getByRole('heading', { name: 'Think in systems' })).toBeVisible();
  await page.getByRole('button', { name: 'Activate the portals' }).click();
  await page.screenshot({ path: `test-results/${info.project.name}-portals.png` });
  await page.getByRole('button', { name: /04 Painting/ }).click();
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `test-results/${info.project.name}-gallery-wide.png` });
  await page.getByRole('button', { name: 'Inspect empty frame 1', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Curating this exhibition' })).toBeVisible();
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `test-results/${info.project.name}-gallery.png` });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('heading', { name: 'Curating this exhibition' })).not.toBeVisible();
  await page.getByRole('link', { name: 'Resume', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('No PDF');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Field guide' }).click();
  for (const state of ['idle', 'wave', 'walk', 'run', 'turn', 'interact', 'celebrate', 'sit']) {
    await page.getByLabel('Temporary guide animation').selectOption(state);
  }
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Quiet mode' }).click();
  await expect(page.getByRole('heading', { name: 'Choose a world.' })).toBeVisible();
  await page.getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Contact details are coming soon');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /01 Engineering/ }).click();
  await expect(page.getByRole('dialog')).toContainText('Curating this exhibition');
  expect(errors).toEqual([]);
});
test('reduced motion and WebGL fallback preserve direct navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  await page.goto('/#about');
  await expect(page.getByRole('dialog')).toContainText('CSE AI/ML student');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('heading', { name: 'Choose a world.' })).toBeVisible();
  await page.getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('0 curated works');
  await page.keyboard.press('Escape');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('returning visitors and command navigation bypass the intro', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('srishti_intro_seen', 'true'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Skip intro' })).not.toBeVisible();
  await page.keyboard.press('Control+k');
  await page.getByLabel('Find a chapter').fill('resume');
  await page.getByLabel('Find a chapter').press('Enter');
  await expect(page.getByRole('dialog')).toContainText('No PDF');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open the sketchbook' })).toBeVisible();
});
test('the five-second intro completes and is remembered', async ({ page }) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Skip intro' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Choose a world.' })).toBeVisible({
    timeout: 9000,
  });
  expect(await page.evaluate(() => sessionStorage.getItem('srishti_intro_seen'))).toBe('true');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Skip intro' })).not.toBeVisible();
});
