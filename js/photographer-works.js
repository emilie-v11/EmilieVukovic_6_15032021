'use strict';
/**
 *  PHOTOGRAPHER'S WORKS
 */
//==================================================================================================
//DOM ELEMENTS
//==================================================================================================

// Photographer work
const containerWorksEl = document.querySelector('.container-works');
const btnLikeEl = document.querySelector('.btn-like');
const workLikeEl = document.querySelectorAll('.work-like');
// console.log(workLikeEl);

// Aside
const totalLikesEl = document.querySelector('.total-likes');

// VARIABLE
let workById = [];
let totalLikesArray = [];
let likesByIDList;
let workCardsArray = [];
let media;
let newMedia = '';

let workMediaEl;
let workMediaItemsEl;
let workMediaItemsArray;
let lightboxMedia;
let activeMedia;

//==================================================================================================
// FETCH JSON
//==================================================================================================

const datasPhotographerPage = Utils.getAllDatas(URL).then(data =>
	renderPhotographerWorks(data)
);

// console.log(ID);
//==================================================================================================
//  Render Photographer Works
//==================================================================================================

// Function render photographers' works
const renderPhotographerWorks = data => {
	media = data.media;
	workById = media.filter(media => media['photographerId'] == ID);

	// Create a map with all likes of current photographer (ID)
	likesByIDList = workById.map(work => work.likes);

	// Calcul the total of the likes' array
	let totalLikes = likesByIDList.reduce((total, likes) => total + likes, 0);
	totalLikesArray.push(totalLikes);
	totalLikesEl.innerHTML = totalLikesArray;

	// sort workById (array works cards) by Popularity by default
	workById.sort((a, b) => b.likes - a.likes);

	// Render the Works Cards
	renderWorksCards();
};

//==============================================
// FACTORY FUNCTION FOR MEDIA IN WORKS' CARDS
//==============================================

function mediaFactory(media) {
	if (media.image !== undefined) {
		return (newMedia = `
            <img id="${media['id']}" class="work__media__item" src='./img/photos/${ID}/${media.image}' alt="${media['alt']}" role="button" tabindex="0" aria-label="photo s'appelant: ${media['alt']}"/>
        `);
	} else {
		return (newMedia = `
            <video id="${media['id']}" class="work__media__item" src='./img/photos/${ID}/${media.video}' role="button" tabindex="0" aria-label="video s'appelant: ${media['alt']}">
                <p class="alt-video">${media['alt']}</p>
            </video>
        `);
	}
}

//==================================================================================================
//  WORKS CARDS
//==================================================================================================

function renderWorksCards() {
	// Render Works Cards (Image - name - price - numb of like & heart icon)
	let newWorkCard = '';

	workById.forEach(work => {
		// Render newWorkCard
		newWorkCard += `
            <article class="work">
                ${mediaFactory(work)}
                <div class="work__infos">
                    <h2 class="work__infos__name">${work['alt']}</h2>
                    <div class="work__infos__likes">
                        <p class="work-like" aria-label="number of like">${
							work.likes
						}</p>
                        <button class="btn-like" aria-label="likes, click for like this photo">
                            <i class="far fa-heart" aria-hidden="true"></i>
                            <i class="fas fa-heart liked" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
		// <span class="work__infos__price">${work.price}€</span>
	});
	containerWorksEl.innerHTML = newWorkCard;

	let workMediaItemsEl = document.querySelectorAll('.work__media__item');

	workMediaItemsArray = Array.from(workMediaItemsEl);
	// console.log(workMediaItemsArray);

	workMediaItemsArray.forEach((image, index) => {
		image.addEventListener('click', () => {
			activeMedia = index;
			setActiveMedia(image);
			openLightbox();
		});
		image.addEventListener('keydown', function (e) {
			if (e.key === 'Enter') {
				activeMedia = index;
				setActiveMedia(image);
				openLightbox();
			}
		});
	});

	//==================================================================================================
	//  Function & Events for like  each Works & total likes
	//==================================================================================================
	let btnLikeArray = Array.from(document.querySelectorAll('.btn-like'));

	btnLikeArray.forEach(btn => {
		btn.addEventListener('click', function (e) {
			e.preventDefault();
			if (!btn.classList.contains('liked')) {
				btn.previousElementSibling.innerHTML++;
				btn.classList.add('liked');
				totalLikesArray++;
			} else {
				btn.previousElementSibling.innerHTML--;
				btn.classList.remove('liked');
				totalLikesArray--;
			}
			document.querySelector('.total-likes').innerHTML = totalLikesArray;
		});
	});
}
