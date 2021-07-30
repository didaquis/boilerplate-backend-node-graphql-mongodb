import { isValidEmail, isStrongPassword } from '../src/helpers/validations.js';

describe('validations', () => {

	describe('isValidEmail', () => {
		test('Should return false if no receive params', () => {
			expect(isValidEmail()).toBe(false);
		});

		test('Should return false if no receive a valid data', () => {
			const fakeData = ['foo', '', 'foo@@foo.foo', 'bar@bar..com', 'biz@biz.', '@foo.mail'];

			fakeData.forEach( data => {
				expect(isValidEmail(data)).toBe(false);
			});
		});

		test('Should return true if receive a valid data', () => {
			const fakeData = ['maria@mail.com', 'john.doe@gmail.com', 'santi72@hotmail.es', 'foo_@yourcompany.it'];

			fakeData.forEach( data => {
				expect(isValidEmail(data)).toBe(true);
			});
		});
	});

	describe('isStrongPassword', () => {
		test('Should return false if no receive params', () => {
			expect(isStrongPassword()).toBe(false);
		});

		test('Should return false if no receive a valid data', () => {
			const fakeData = ['foo', '', '123', 'patata', 'PATATA.', '*', 'Pa1*', 'A2*aaaa', 'abcdefghijkl', 'My-Password', '82569285927659'];

			fakeData.forEach( data => {
				expect(isStrongPassword(data)).toBe(false);
			});
		});

		test('Should return true if receive a valid data', () => {
			const fakeData = ['abcABC123', 'Pat*ta_72', 'Lol#u&8$', 'My-P4ssw0rd', 'w!w_393_MiM', '*ZGw2sEse!uE', 'ByRN*e&M4%xD', 'syW_ntrq-^LEW8D7', 'ExNbNJa8^mtp3f#e', 'gsY*AL-J9A7?-h2c', 'y6XQw+3H4Cef#QCtudX8ZPF5', '34mDnZTPecVpnxmvwGMW9mWY5g', 'jw2AFhSB'];

			fakeData.forEach( data => {
				expect(isStrongPassword(data)).toBe(true);
			});
		});
	});
});