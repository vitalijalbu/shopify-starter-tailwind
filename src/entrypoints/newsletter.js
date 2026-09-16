const CONFIG = {
	apiUrl: 'https://sportbusinessmag.sport-press.it/skimofestival-shopify-middleware/shopify.php', 
};

class NewsletterAC {
	constructor() {
		if (NewsletterAC.instance) {
			return NewsletterAC.instance;
		}
		NewsletterAC.instance = this;
		
		this.handleSubmit = this.handleSubmit.bind(this);
		this.init();
	}

	init() {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => {
				this.attachEvents();
			});
		} else {
			this.attachEvents();
		}
	}

	attachEvents() {
		const forms = document.querySelectorAll(
			'.newsletter-activecampaign, #newsletter_form, #footer-newsletter',
		);

		forms.forEach((form) => {
			form.removeEventListener('submit', this.handleSubmit);
			form.addEventListener('submit', this.handleSubmit);
		});
	}

	handleSubmit(e) {
		e.preventDefault();
		e.stopPropagation();

		this.processSubmit(e);

		return false;
	}

	async processSubmit(e) {
		const form = e.target;
		const formData = new FormData(form);

		const email = formData.get('nesletter[email]') || formData.get('email');
		const firstName =
			formData.get('nesletter[first_name]') || formData.get('firstName') || '';
		const lastName =
			formData.get('nesletter[last_name]') || formData.get('lastName') || '';
		const phone =
			formData.get('nesletter[phone]') || formData.get('phone') || '';

		if (!email || !this.isValidEmail(email)) {
			this.showError(form, 'Inserisci un indirizzo email valido');
			return;
		}

		const btn = form.querySelector('button[type="submit"]');
		const originalText = btn.innerHTML;
		btn.innerHTML = 'Invio...';
		btn.disabled = true;

		try {
			const result = await this.sendToAPI(email, firstName, lastName, phone);

			if (result.success) {
				this.showSuccess(form);
				form.reset();
			} else {
				this.showError(
					form,
					result.message || "Errore durante l'iscrizione. Riprova.",
				);
			}
		} catch (error) {
			console.error('Newsletter error:', error);
			this.showError(form, 'Errore di connessione. Riprova più tardi.');
		} finally {
			btn.innerHTML = originalText;
			btn.disabled = false;
		}
	}

	async sendToAPI(email, firstName, lastName, phone) {
		try {
			const response = await fetch(CONFIG.apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					email: email,
					firstName: firstName,
					lastName: lastName,
					phone: phone,
					newsletter: true,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || 'Errore del server');
			}

			const result = await response.json();
			return result;
		} catch (error) {
			console.error('API request failed:', error);
			throw error;
		}
	}

	isValidEmail(email) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	showSuccess(form) {
		const existingError = form.querySelector('.newsletter-error');
		if (existingError) existingError.remove();

		let messageId = 'newsletter-message';
		if (form.id === 'footer-newsletter') {
			messageId = 'footer-newsletter-message';
		}

		let messageContainer = document.getElementById(messageId);

		if (messageContainer) {
			messageContainer.innerHTML = `
				<div class="newsletter-success p-4 bg-green-100 text-green-800 rounded border border-green-200">
					<p class="text-base font-medium">✓ Iscrizione completata con successo!</p>
					<p class="text-xs mt-1">Controlla la tua email per confermare.</p>
				</div>
			`;
			messageContainer.style.display = 'block';
			form.style.display = 'none';
		} else {
			const successMsg = document.createElement('div');
			successMsg.className =
				'newsletter-success mt-3 p-4 bg-green-100 text-green-800 rounded border border-green-200';
			successMsg.innerHTML = `
				<p class="text-base font-medium">✓ Iscrizione completata con successo!</p>
				<p class="text-xs mt-1">Controlla la tua email per confermare.</p>
			`;

			const inputs = form.querySelectorAll('input, button');
			inputs.forEach((input) => (input.style.display = 'none'));
			form.appendChild(successMsg);
		}
	}

	showError(form, message) {
		const existingError = form.querySelector('.newsletter-error');
		if (existingError) existingError.remove();

		const errorMsg = document.createElement('div');
		errorMsg.className =
			'newsletter-error mt-3 p-3 bg-red-100 text-red-800 rounded border border-red-200';
		errorMsg.innerHTML = `<p class="text-base">⚠ ${message}</p>`;

		form.appendChild(errorMsg);

		setTimeout(() => {
			if (errorMsg.parentNode) {
				errorMsg.remove();
			}
		}, 4000);
	}
}

new NewsletterAC();

export default NewsletterAC;
