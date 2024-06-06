const { test, expect } = require('@playwright/test');

test('Verify "All Books" link is visible', async ({ page }) => {

    await page.goto('http://localhost:3000');
    await page.waitForSelector('nav.navbar');

    const allBooksLink = await page.$('a[href="/catalog"]');
    const isLinkVisible = await allBooksLink.isVisible();

    expect(isLinkVisible).toBe(true);
});

test('Verify "Login" button is visible', async ({ page }) => {

    await page.goto('http://localhost:3000');
    await page.waitForSelector('nav.navbar');

    const loginButton = await page.$('a[href="/login"]');
    const isLoginButtonVisible = await loginButton.isVisible();

    expect(isLoginButtonVisible).toBe(true);
});

test('Verify "Register" button is visible', async ({ page }) => {

    await page.goto('http://localhost:3000');
    await page.waitForSelector('nav.navbar');

    const registerButton = await page.$('a[href="/register"]');
    const isRegisterButtonVisible = await registerButton.isVisible();

    expect(isRegisterButtonVisible).toBe(true);
});

test('Verify "All Books" link is visible after login', async ({ page }) => {

    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');

    const allBooksLink = await page.$('a[href="/catalog"]');
    const isAllBooksLinkVisible = await allBooksLink.isVisible();

    expect(isAllBooksLinkVisible).toBe(true);
});

test('Verify "My Books" link is visible after login', async ({ page }) => {

    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');

    const myBooksLink = await page.$('a[href="/profile"]');
    const isMyBooksLinkVisible = await myBooksLink.isVisible();

    expect(isMyBooksLinkVisible).toBe(true);
});

test('Verify "Add Book" link is visible after login', async ({ page }) => {

    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');

    const addBookLink = await page.$('a[href="/create"]');
    const isAddBookLinkVisible = await addBookLink.isVisible();

    expect(isAddBookLinkVisible).toBe(true);
});

test('Submit form with empty input fields', async({page}) => {
    await page.goto('http://localhost:3000/login');
    await page.click('input[type="submit"]');
    // We should listen for the dialog event, which would visualize an alert popup window with the warning 
    // message. After that we, should verify that the dialog type is indeed alert and check if the message is the same as 
    // in the login.js file. Finally, we should click on the [OK] button in order to dismiss the alert window.
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
        // We should also check whether we have been redirected to the right page or not
    });
    await page.$('a[href="/login"]');
    expect(page.url()).toBe('http://localhost:3000/login');
});

test('Add book with correct data', async({page})=> {
    /* We have to go to the "Login" page and fill in the predefined email and password credentials and click on the
    [Submit] button in order to be logged-in, as only logged-in users can add books */
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3000/catalog')
    ]);
    // go to the "Add Book" page via the navigation menu link
    await page.click('a[href="/create"]');
    // wait for the form to load
    await page.waitForSelector('#create-form');
    // after the form has loaded, fill in the book details with dummy data
    await page.fill('#title', 'Test Book');
    await page.fill('#description', 'This is a test book description');
    await page.fill('#image', 'https://example.com/book-image.jpg');
    await page.selectOption('#type', 'Fiction');
    // once finished, click submit button
    await page.click('#create-form input[type="submit"]');
    // verify that we're being redirected to the correct page – this is our indicator that the book has been successfully added:
    await page.waitForURL('http://localhost:3000/catalog');
    expect(page.url()).toBe('http://localhost:3000/catalog')
});


