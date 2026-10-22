'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..');

test('Validação de Metatag Viewport em HTML', () => {
    const htmlFiles = fs.readdirSync(RAIZ).filter(f => f.endsWith('.html'));
    for (const file of htmlFiles) {
        const content = fs.readFileSync(path.join(RAIZ, file), 'utf8');
        assert.ok(content.includes('viewport'), `Arquivo ${file} deve conter a metatag viewport`);
    }
});

test('Validação de Media Queries e Responsividade CSS', () => {
    const cssFiles = fs.readdirSync(RAIZ).filter(f => f.endsWith('.css'));
    let hasMedia = false;
    for (const file of cssFiles) {
        const content = fs.readFileSync(path.join(RAIZ, file), 'utf8');
        if (content.includes('@media')) hasMedia = true;
    }
    assert.ok(hasMedia, 'CSS deve conter media queries para viewports (375px, 768px, 1200px+)');
});
