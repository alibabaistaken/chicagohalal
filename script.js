let restaurantData = [];

document.addEventListener('DOMContentLoaded', function () {
  // Add restaurant button redirect
  const addRestaurantBtn = document.getElementById('addRestaurantBtn');
  const googleFormURL = 'https://docs.google.com/forms/d/e/1FAIpQLSdZvdFuL9dkGGwbAkHAaj5fWBfznhkF-22XLC_SXEKcieu9kg/viewform?usp=header';
  if (addRestaurantBtn) {
    addRestaurantBtn.addEventListener('click', () => {
      window.open(googleFormURL, '_blank');
    });
  }

  // Fetch and display restaurants
  async function fetchRestaurants() {
    try {
      const response = await fetch('restaurants.json');
      const data = await response.json();
      restaurantData = data;
      displayRestaurants(data);
    } catch (err) {
      console.error('Error loading restaurants.json:', err);
      document.getElementById('restaurantList').innerHTML =
        '<p class="text-red-400">Failed to load restaurant data.</p>';
    }
  }

  function displayRestaurants(data) {
    const container = document.getElementById('restaurantList');
    container.innerHTML = '';
    data.forEach((r) => {
      const card = document.createElement('div');
      card.className =
        'bg-card rounded-2xl p-6 backdrop-blur-xs shadow-md hover:shadow-xl transition duration-300 cursor-pointer';
      card.innerHTML = `
        <h3 class="text-xl font-bold mb-2 text-neon">${r.name}</h3>
        <p class="text-gray-400">${r.cuisine} • ${r.neighborhood} • ${r.price}</p>
        <p class="text-sm mt-2 text-white/80">${r.cert}</p>
      `;
      card.addEventListener('click', () => openModal(r));
      container.appendChild(card);
    });
  }

  function openModal(data) {
    document.getElementById('modalName').textContent = data.name;
    document.getElementById('modalContent').innerHTML = `
      <p><strong>Cuisine:</strong> ${data.cuisine}</p>
      <p><strong>Neighborhood:</strong> ${data.neighborhood}</p>
      <p><strong>Price:</strong> ${data.price}</p>
      <p><strong>Halal Cert:</strong> ${data.cert}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Address:</strong> ${data.address}</p>
    `;
    const websiteBtn = document.getElementById('modalWebsite');
    websiteBtn.href = data.website || '#';
    websiteBtn.style.display = data.website ? 'inline-block' : 'none';

    const modal = document.getElementById('modal');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100');
  }

  document.getElementById('modalClose').addEventListener('click', () => {
    const modal = document.getElementById('modal');
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.classList.remove('opacity-100');
  });

  document.getElementById('randomPick').addEventListener('click', () => {
    if (restaurantData.length > 0) {
      const randomIndex = Math.floor(Math.random() * restaurantData.length);
      openModal(restaurantData[randomIndex]);
    }
  });

  // 🔥 FILTERS
  function applyFilters() {
    const cuisine = document.getElementById('filterCuisine').value;
    const neighborhood = document.getElementById('filterNeighborhood').value;
    const price = document.getElementById('filterPrice').value;
    const cert = document.getElementById('filterCert').value;

    const filtered = restaurantData.filter((r) => {
      return (
        (!cuisine || r.cuisine === cuisine) &&
        (!neighborhood || r.neighborhood === neighborhood) &&
        (!price || r.price === price) &&
        (!cert || r.cert === cert)
      );
    });

    displayRestaurants(filtered);
  }

  // Attach change listeners to filters
  ['filterCuisine', 'filterNeighborhood', 'filterPrice', 'filterCert'].forEach((id) => {
    document.getElementById(id).addEventListener('change', applyFilters);
  });

  fetchRestaurants();
});