document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const dice1 = document.getElementById('dice1');
    const dice2 = document.getElementById('dice2');
    const rolls = document.getElementById('rolls');
    const score = document.getElementById('score');
    const catCount = document.getElementById('catCount');
    const catAverage = document.getElementById('catAverage');
    const diceType = document.getElementById('diceType');
    const catContainer = document.createElement('div');
    catContainer.classList.add('cat-container');
    document.body.appendChild(catContainer);

    let rollsCount = 0;
    let totalScore = 0;
    let catImageCount = 0;
    let interval;
    const catImages = [];

    const rollHistory = [];
    const numRollsValue = 20; // Fixed number of rolls

    const ctx = document.getElementById('diceChart').getContext('2d');
    const diceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 100 }, (_, i) => i + 1),
            datasets: [{
                label: 'Dice Roll Sum',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    function updateChart(newSum) {
        if (rollHistory.length >= 100) {
            rollHistory.shift();
        }
        rollHistory.push(newSum);
        diceChart.data.datasets[0].data = rollHistory;
        diceChart.update();
    }

    function displayCatImages() {
        catContainer.innerHTML = ''; // Clear previous cats
        const numCats = Math.floor(Math.random() * 5) + 1; // Random number of cats (1-5)
        for (let i = 0; i < numCats; i++) {
            const randomIndex = Math.floor(Math.random() * catImages.length);
            const catImage = document.createElement('img');
            catImage.src = catImages[randomIndex];
            catImage.classList.add('cat-image');
            catImage.style.top = `${Math.random() * 80 + 10}%`; // Randomly position between 10% and 90% of the height
            catImage.style.left = `${Math.random() * 80 + 10}%`; // Randomly position between 10% and 90% of the width
            catContainer.appendChild(catImage);
            catImageCount++;
        }
        catCount.textContent = catImageCount;
        catAverage.textContent = (catImageCount / rollsCount).toFixed(2);
    }

    function rollDiceSequentially(sides) {
        rollsCount = 0;
        totalScore = 0;
        rollHistory.length = 0;
        catImageCount = 0;

        let rollIndex = 0;
        interval = setInterval(() => {
            if (rollIndex >= numRollsValue) {
                clearInterval(interval);
                startButton.disabled = false;
                stopButton.style.display = 'none';
                return;
            }

            const roll1 = Math.floor(Math.random() * sides) + 1;
            const roll2 = Math.floor(Math.random() * sides) + 1;
            const rollSum = roll1 + roll2;
            rollsCount++;
            totalScore += rollSum;

            dice1.textContent = roll1;
            dice2.textContent = roll2;
            rolls.textContent = rollsCount;
            score.textContent = totalScore;

            updateChart(rollSum);
            displayCatImages();

            rollIndex++;
        }, 500); // Adjust time interval as needed
    }

    function fetchCatImages() {
        fetch('https://api.thecatapi.com/v1/images/search?limit=50') // Fetch 50 images
            .then(response => response.json())
            .then(data => {
                data.forEach(cat => {
                    catImages.push(cat.url);
                });
            })
            .catch(error => console.error('Error fetching cat images:', error));
    }

    fetchCatImages(); // Fetch cat images on load

    startButton.addEventListener('click', () => {
        startButton.disabled = true;
        stopButton.style.display = 'block';
        const sides = parseInt(diceType.value);
        rollDiceSequentially(sides);
    });

    stopButton.addEventListener('click', () => {
        clearInterval(interval);
        startButton.disabled = false;
        stopButton.style.display = 'none';
    });
});
