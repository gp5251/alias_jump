const assert = require('assert');
const path = require('path');
const { getFilePath } = require('../../utils');

// 兼容jest
const describe = suite
const expect = function (s1){
	return {
		toBe(s2){
			assert.equal(s1, s2)
		}
	}
}

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// const vscode = require('vscode');
// // const myExtension = require('../extension');

// suite('Extension Test Suite', () => {
// 	vscode.window.showInformationMessage('Start all tests.');

// 	test('Sample test', () => {
// 		assert.equal(-1, [1, 2, 3].indexOf(5));
// 		assert.equal(-1, [1, 2, 3].indexOf(0));
// 	});
// });

describe('test jump-to-definition', () => {
	let filePath;
	let curFilePath
	let alias;

	const rootPath = '/home/paul/prj'

	test('getFilePath in one project', () => {
		alias = {
			"@": '/src',
			"@pages": '/src/pages'
		}
		curFilePath = '/home/paul/prj/src/js/app.js';

		filePath = getFilePath(curFilePath, '@/utils', rootPath, {alias});
		expect(filePath).toBe(path.join(rootPath, 'src/utils'))

		filePath = getFilePath(curFilePath, '@pages/pageA', rootPath, {alias});
		expect(filePath).toBe(path.join(rootPath, 'src/pages/pageA'))
	});

	test('getFilePath in multi projects', () => {
		alias = {
			"@": ['/a/src', '/b/src', '/c/src', '/src'],
			"@utils": ['/a/src/utils', '/b/src/utils', '/c/src/utils'],
			"@a_b": ['/a/src/a_b', '/b/src/a_b'],
			"@a_pages": 'a/src/pages',
			"@b_common": 'b/src/common'
		};

		// @ => /src
		curFilePath = '/home/paul/prj/src/js/app.js';
		filePath = getFilePath(curFilePath, '@/utils', rootPath, {alias});
		expect(filePath).toBe(path.join(rootPath, 'src/utils'))

		// @ => /a/src
		curFilePath = '/home/paul/prj/a/src/js/app.js';
		filePath = getFilePath(curFilePath, '@/utils', rootPath, {alias});
		expect(filePath).toBe(path.join(rootPath, 'a/src/utils'))

		// @ => /a/src
		curFilePath = '/home/paul/prj/a/src/js/app.js';
		filePath = getFilePath(curFilePath, '@/utils/a', rootPath, {alias});
		expect(filePath).toBe(path.join(rootPath, 'a/src/utils/a'))

		// @utils => /a/src/utils
		curFilePath = '/home/paul/prj/a/src/js/app.js';
		filePath = getFilePath(curFilePath, '@utils/a/b', rootPath, {alias});
		expect(filePath).toBe(path.join(rootPath, 'a/src/utils/a/b'))

		curFilePath = '/home/paul/prj/a/src/js/app.js';
		filePath = getFilePath(curFilePath, '@a_pages/pageA', rootPath, {alias});
		expect(filePath).toBe(path.join(rootPath, 'a/src/pages/pageA'))

		curFilePath = '/home/paul/prj/b/src/js/app.js';
		filePath = getFilePath(curFilePath, '@utils/a/b', rootPath, {alias});
		expect(filePath).toBe(path.join(rootPath, 'b/src/utils/a/b'))

		curFilePath = '/home/paul/prj/b/src/js/app.js';
		filePath = getFilePath(curFilePath, '@b_common/c1', rootPath, {alias});
		expect(filePath).toBe(path.join(rootPath, 'b/src/common/c1'))

		curFilePath = '/home/paul/prj/a/src/js/app.js';
		filePath = getFilePath(curFilePath, '@a_b/aaa', rootPath, {alias});
		expect(filePath).toBe(path.join(rootPath, 'a/src/a_b/aaa'))
	});
});
