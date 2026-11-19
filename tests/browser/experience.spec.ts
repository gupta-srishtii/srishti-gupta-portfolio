import { test, expect } from '@playwright/test';

test('the landing guide moves after skipping with a navigation button focused', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Skip intro' }).click();
  await page.getByRole('button', { name: 'Return to atelier' }).focus();
  const canvas = page.locator('canvas');
  const axis = async (attribute: string, i: number) =>
    Number((await canvas.getAttribute(attribute))?.split(',')[i]);
  await expect(canvas).toHaveAttribute('data-mascot-world', '0.000,3.200', { timeout: 20_000 });
  const screen = await axis('data-mascot-screen', 0);
  await page.keyboard.down('ArrowRight');
  await expect.poll(() => axis('data-mascot-world', 0)).toBeGreaterThan(0.35);
  await expect.poll(() => axis('data-mascot-screen', 0)).toBeGreaterThan(screen + 0.055);
  await page.keyboard.up('ArrowRight');
  await expect(canvas).toHaveAttribute('data-mascot-gait', 'idle');
  await page.keyboard.down('w');
  await expect.poll(() => axis('data-mascot-world', 1)).toBeLessThan(2.35);
  await page.keyboard.up('w');
});

test('six physical chapters enter distinct worlds and return to the book', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();
  await expect
    .poll(async () => Number(await page.locator('canvas').getAttribute('data-draw-calls')), {
      timeout: 20_000,
    })
    .toBeGreaterThan(20);
  await page.screenshot({ path: 'test-results/' + info.project.name + '-atelier.png' });
  await page.getByRole('button', { name: 'Open the sketchbook' }).click();
  await page.getByRole('button', { name: 'Work index', exact: true }).click();
  await expect(
    page.getByRole('dialog').getByRole('link', { name: /Numerical Area & Volume Calculator/ }),
  ).toHaveAttribute('href', 'https://github.com/gupta-srishtii/area-and-volume');
  await page.keyboard.press('Escape');
  const chapters = [
    'Graphic Design',
    'Technical Projects',
    'Art & Hobbies',
    'Books & Stories',
    'Memories, Achievements & Handmade Creations',
    'Video Editing',
  ];
  const worlds = [
    'The design gallery',
    'The invention lab',
    'The painter’s greenhouse',
    'The book tree',
    'The keepsake archive',
    'The film room',
  ];
  for (let i = 0; i < chapters.length; i++) {
    await expect(page.getByRole('heading', { name: chapters[i], exact: true })).toBeAttached();
    if (i === 0) await page.screenshot({ path: 'test-results/' + info.project.name + '-book.png' });
    await page.getByRole('button', { name: 'Enter ' + worlds[i] + ' ↗', exact: true }).click();
    await expect(
      page.getByRole('button', {
        name: i === 1 ? 'Inspect Numerical Area & Volume Calculator' : 'Inspect empty frame 1',
        exact: true,
      }),
    ).toBeVisible();
    await page.screenshot({ path: 'test-results/' + info.project.name + '-realm-' + i + '.png' });
    if (i === 0) {
      await page.getByRole('button', { name: 'Visit the UI/UX studio' }).click();
      await expect(
        page.getByRole('heading', { name: 'The UI/UX studio', exact: true }),
      ).toBeVisible();
      await page.getByRole('button', { name: 'Visit the graphic design gallery' }).click();
      await expect(
        page.getByRole('heading', { name: 'Graphic design', exact: true }),
      ).toBeVisible();
      const before = await page.locator('canvas').getAttribute('data-camera');
      await page.keyboard.down('w');
      await page.waitForTimeout(350);
      await page.keyboard.up('w');
      await expect.poll(() => page.locator('canvas').getAttribute('data-camera')).not.toBe(before);
      await page.getByRole('button', { name: 'Inspect empty frame 1', exact: true }).click();
      await expect(page.getByRole('heading', { name: 'Curating this exhibition' })).toBeVisible();
      await page.keyboard.press('Escape');
    }
    if (i === 1) {
      await page
        .getByRole('button', { name: 'Inspect Numerical Area & Volume Calculator' })
        .click();
      const details = page.locator('.inspection');
      await expect(details.getByRole('link', { name: 'Repository' })).toHaveAttribute(
        'href',
        'https://github.com/gupta-srishtii/area-and-volume',
      );
      await expect(details.getByRole('link', { name: /related CM-PBL fork/i })).toHaveAttribute(
        'href',
        'https://github.com/gupta-srishtii/CM-PBL',
      );
      await page.keyboard.press('Escape');
    }
    await page.getByRole('button', { name: '← Sketchbook' }).click();
    await expect(page.getByRole('heading', { name: chapters[i], exact: true })).toBeAttached();
    if (i < 5) await page.getByRole('button', { name: 'Next chapter' }).click();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('animated cover reveal, page turn, professional pages and original audio', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Skip intro' }).click();
  await page.getByRole('button', { name: 'Open the sketchbook' }).click();
  await page.waitForTimeout(3200);
  await page.screenshot({ path: 'test-results/' + info.project.name + '-reveal.png' });
  await page.waitForTimeout(4700);
  await page.screenshot({ path: 'test-results/' + info.project.name + '-open-book.png' });
  await page.getByRole('button', { name: 'Next chapter' }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'test-results/' + info.project.name + '-page-turn.png' });
  await expect(
    page.getByRole('heading', { name: 'Technical Projects', exact: true }),
  ).toBeAttached();
  await page.getByRole('button', { name: 'Enter The invention lab ↗', exact: true }).click();
  await page.getByRole('button', { name: '← Sketchbook' }).click();
  await expect(
    page.getByRole('heading', { name: 'Technical Projects', exact: true }),
  ).toBeAttached();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'test-results/' + info.project.name + '-returned-book.png' });
  for (const [link, text] of [
    ['About', 'I explore graphic design'],
    ['Resume', 'No PDF'],
    ['Contact', 'Contact details are coming soon'],
  ]) {
    await page.getByRole('link', { name: link, exact: true }).click();
    await expect(page.getByRole('region', { name: 'Sketchbook pages' })).toContainText(text);
  }
  await page.getByRole('button', { name: 'Play ambient music' }).click();
  await expect(page.getByRole('button', { name: 'Mute ambient music' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByLabel('Ambient volume').focus();
  await page.getByLabel('Ambient volume').press('Home');
  await expect(page.getByLabel('Ambient volume')).toHaveValue('0');
  await page.getByRole('button', { name: 'Mute ambient music' }).click();
  await expect(page.getByRole('button', { name: 'Play ambient music' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('WebGL fallback and command search retain professional access', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  await page.goto('/#about');
  await expect(page.getByRole('region', { name: 'Sketchbook pages' })).toContainText(
    'I explore graphic design',
  );
  await page.keyboard.press('Control+k');
  await page.getByLabel('Find a chapter').fill('resume');
  await page.getByLabel('Find a chapter').press('Enter');
  await expect(page.getByRole('region', { name: 'Sketchbook pages' })).toContainText('No PDF');
  await page.getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Graphic Design', exact: true })).toBeVisible();
});

test('ten-second opening is skippable and remembered', async ({ page }) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Skip intro' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Choose a world.' })).toBeVisible({
    timeout: 15000,
  });
  expect(await page.evaluate(() => sessionStorage.getItem('srishti_intro_seen'))).toBe('true');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Skip intro' })).not.toBeVisible();
});
