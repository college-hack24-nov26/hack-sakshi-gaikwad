document.addEventListener("DOMContentLoaded", () => {

    // Mobile navigation
    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("mainNav");

    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            nav.classList.toggle("show");
        });
    }


    // Restaurant search and category filter
    const grid = document.getElementById("restaurantGrid");

    if (grid) {

        const cards = [...grid.querySelectorAll(".restaurant-card")];

        const search = document.getElementById("restaurantSearch");

        const buttons = document.querySelectorAll(".filter-btn");

        const empty = document.getElementById("noRestaurants");

        let selected = "All";

        function updateRestaurants() {

            const term = (search?.value || "").trim().toLowerCase();

            let visible = 0;

            cards.forEach(card => {

                const matchesCategory =
                    selected === "All" ||
                    card.dataset.category === selected;

                const matchesSearch =
                    (card.dataset.name || "").toLowerCase().includes(term);

                const show = matchesCategory && matchesSearch;

                card.hidden = !show;

                if (show) {
                    visible++;
                }

            });

            if (empty) {
                empty.hidden = visible !== 0;
            }

        }

        buttons.forEach(button => {

            button.addEventListener("click", () => {

                selected = button.dataset.filter;

                buttons.forEach(item => {
                    item.classList.toggle("selected", item === button);
                });

                updateRestaurants();

            });

        });

        if (search) {
            search.addEventListener("input", updateRestaurants);
        }

    }


    // Contact form demo
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", event => {

            event.preventDefault();

            const name =
                document.getElementById("contactName").value.trim();

            const email =
                document.getElementById("contactEmail").value.trim();

            const subject =
                document.getElementById("contactSubject").value;

            const message =
                document.getElementById("contactMessage").value.trim();

            if (!name || !email || !subject || !message) {

                alert("Please fill in all fields.");

                return;

            }

            alert("Thank you, " + name + "! Your demo message has been received.");

            contactForm.reset();

        });

    }

});