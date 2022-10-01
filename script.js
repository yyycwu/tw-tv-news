const monday = new Date('2022-09-26');
{
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = "style.css";
	document.body.appendChild(link);
}
addEventListener('DOMContentLoaded', () => {
	function setDay1() {
		setDay(1);
	}
	for (const tr of document.querySelectorAll('thead>tr')) {
		const ths = tr.querySelectorAll('th');
		let l = ths.length;
		if (l !== 8) { continue; }
		while (--l) {
			const th = ths[l];
			th.onpointerenter = setDay.bind(null, l);
			th.onpointerleave = setDay1;
			th.onclick = openProgramList;
		}
	}
});
function setDay(day = 1) {
	datePicker.date.setUTCFullYear(monday.getUTCFullYear());
	datePicker.date.setUTCMonth(monday.getUTCMonth());
	datePicker.date.setUTCDate(monday.getUTCDate() + day - 1);
	datePicker.dateInput.value = datePicker.date.toISOString().slice(0, 10);
}
class DatePicker extends HTMLElement {
	leftButton = this.createButton('<');
	dateInput = this.createDateInput(monday);
	rightButton = this.createButton('>');
	date = new Date;
	constructor() {
		super();
		this.appendChild(this.leftButton);
		this.appendChild(this.dateInput);
		this.appendChild(this.rightButton);
	}
	createButton(text = '') {
		const button = document.createElement('button');
		button.textContent = text;
		button.disabled = true;
		return button;
	}
	createDateInput(value = '') {
		const input = document.createElement('input');
		input.type = 'date';
		input.value = value;
		return input;
	}
	attach(parent) {
		(parent || document.body).appendChild(this);
	}
}
customElements.define('date-picker', DatePicker);
const datePicker = new DatePicker;
datePicker.attach(document.querySelector('h1'));
setDay(1);
let programListA = null;
{
	const allA = document.querySelectorAll('a');
	for (let i = 0; i < allA.length; i++) {
		if (allA[i].textContent === '<') {
			const leftA = allA[i];
			const rightA = leftA.nextElementSibling;
			if (
				rightA !== allA[i + 1] ||
				rightA.textContent !== '>'
			) { continue; }
			programListA = rightA.nextElementSibling;
			leftA.remove();
			rightA.remove();
			if (leftA.getAttribute('href')) {
				datePicker.leftButton.onclick = () => {
					leftA.click();
				};
				datePicker.leftButton.disabled = false;
			}
			if (rightA.getAttribute('href')) {
				datePicker.rightButton.onclick = () => {
					rightA.click();
				};
				datePicker.rightButton.disabled = false;
			}
			if (
				programListA !== allA[i + 2] ||
				programListA.textContent !== '節目表') {
				i++;
				continue;
			}
			if (programListA.getAttribute('href')) {
				const iso = monday.toISOString().slice(0, 10);
				programListA.href += iso.slice(0, 7).replace('-', '/') + '/#cdate=' + iso;
			} else {
				programListA = null;
			}
			break;
		}
	}
}
function openProgramList() {
	if (programListA === null) { return; }
	open(programListA.href.replace(/#[^#]+/, '#cdate=' + datePicker.date.toISOString.slice(0, 10)));
}