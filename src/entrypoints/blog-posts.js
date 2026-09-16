import axios from 'axios';

const CONFIG = {
	apiUrl: 'https://outdoormagazine.it/wp-json/wp/v2/posts',
	postsPerPage: 6,
};

class BlogPosts {
	constructor() {
		if (BlogPosts.instance) {
			return BlogPosts.instance;
		}
		BlogPosts.instance = this;

		this.currentPage = 1;
		this.totalPages = 1;
		this.isLoading = false;

		this.init();
	}

	init() {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => {
				this.setupBlogPosts();
			});
		} else {
			this.setupBlogPosts();
		}
	}

	setupBlogPosts() {
		this.container = document.getElementById('blog-posts-container');
		if (!this.container) return;

		this.postsGrid = this.container.querySelector('#posts-grid');
		this.pagination = this.container.querySelector('#posts-pagination');
		this.prevBtn = this.container.querySelector('#prev-page');
		this.nextBtn = this.container.querySelector('#next-page');
		this.pageInfo = this.container.querySelector('#page-info');

		if (this.prevBtn) {
			this.prevBtn.addEventListener('click', () => this.changePage('prev'));
		}
		if (this.nextBtn) {
			this.nextBtn.addEventListener('click', () => this.changePage('next'));
		}

		this.fetchPosts();
	}

	async fetchPosts(page = 1) {
		if (this.isLoading) return;

		this.isLoading = true;
		this.showLoading();

		try {
			const response = await axios.get(CONFIG.apiUrl, {
				params: {
					page: page,
					tags: 4905,
					lang: 'it',
					per_page: CONFIG.postsPerPage,
					_embed: true,
				},
			});

			this.totalPages = parseInt(response.headers['x-wp-totalpages']) || 1;
			this.currentPage = page;

			this.renderPosts(response.data);
			this.updatePagination();
		} catch (error) {
			console.error('Error fetching blog posts:', error);
			this.showError();
		} finally {
			this.isLoading = false;
			this.hideLoading();
		}
	}

	renderPosts(posts) {
		if (!this.postsGrid) return;

		if (posts.length === 0) {
			this.postsGrid.innerHTML = `
				<div class="col-span-full text-center py-12">
					<p class="text-lg text-gray-600">Nessun post trovato.</p>
				</div>
			`;
			return;
		}

		const postsHTML = posts
			.map((post) => {
				const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
				const excerpt = this.stripHtml(post.excerpt.rendered);
				const date = new Date(post.date).toLocaleDateString('it-IT', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				});

				return `
					<article class="bg-white rounded-2xl overflow-hidden h-full flex flex-col">
						${
							featuredImage
								? `
							<a href="${post.link}" target="_blank" rel="noopener noreferrer" class="block aspect-video overflow-hidden">
								<img src="${featuredImage}" alt="${this.stripHtml(post.title.rendered)}"
									class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
									loading="lazy">
							</a>
						`
								: ''
						}
						<div class="p-6 flex flex-col justify-between flex-1">
							<h3 class="text-xl font-bold mb-3 block hover:underline">
								<a href="${post.link}" target="_blank" rel="noopener noreferrer" class="text-3xl">
									${post.title.rendered}
								</a>
							</h3>
							<a href="${post.link}" target="_blank" rel="noopener noreferrer"
								class="inline-flex items-center underline mt-auto">
								Leggi la news
								<svg class="size-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6m0 0H9m9 0v9"/>
								</svg>
							</a>
						</div>
					</article>
				`;
			})
			.join('');

		this.postsGrid.innerHTML = postsHTML;

		window.scrollTo({
			top: this.container.offsetTop - 100,
			behavior: 'smooth',
		});
	}

	updatePagination() {
		if (!this.pagination) return;

		if (this.totalPages <= 1) {
			this.pagination.style.display = 'none';
			return;
		}

		this.pagination.style.display = 'flex';

		if (this.prevBtn) {
			this.prevBtn.disabled = this.currentPage <= 1;
			this.prevBtn.classList.toggle('opacity-50', this.currentPage <= 1);
			this.prevBtn.classList.toggle('cursor-not-allowed', this.currentPage <= 1);
		}

		if (this.nextBtn) {
			this.nextBtn.disabled = this.currentPage >= this.totalPages;
			this.nextBtn.classList.toggle('opacity-50', this.currentPage >= this.totalPages);
			this.nextBtn.classList.toggle('cursor-not-allowed', this.currentPage >= this.totalPages);
		}

		if (this.pageInfo) {
			this.pageInfo.textContent = `Pagina ${this.currentPage} di ${this.totalPages}`;
		}
	}

	changePage(direction) {
		if (this.isLoading) return;

		const newPage =
			direction === 'prev' ? this.currentPage - 1 : this.currentPage + 1;

		if (newPage < 1 || newPage > this.totalPages) return;

		this.fetchPosts(newPage);
	}

	showLoading() {
		if (!this.postsGrid) return;

		this.postsGrid.innerHTML = `
			<div class="col-span-full flex items-center justify-center py-12">
				<div class="flex flex-col items-center gap-4">
					<div class="size-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
					<p class="text-gray-600">Caricamento delle news...</p>
				</div>
			</div>
		`;
	}

	hideLoading() {
	}

	showError() {
		if (!this.postsGrid) return;

		this.postsGrid.innerHTML = `
			<div class="col-span-full text-center py-12">
				<div class="text-red-600 mb-4">
					<svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
				</div>
				<p class="text-lg text-gray-800 mb-2">Errore nel caricamento dei post</p>
				<p class="text-gray-600">Riprova più tardi</p>
			</div>
		`;
	}

	stripHtml(html) {
		const tmp = document.createElement('DIV');
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || '';
	}
}

if (typeof window !== 'undefined') {
	new BlogPosts();
}

