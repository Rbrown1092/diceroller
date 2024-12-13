document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const dice1 = document.getElementById('dice1');
    const dice2 = document.getElementById('dice2');
    const rolls = document.getElementById('rolls');
    const score = document.getElementById('score');
    const catCount = document.getElementById('catCount');
    const catAverage = document.getElementById('catAverage');
    const catContainer = document.createElement('div');
    catContainer.classList.add('cat-container');
    document.body.appendChild(catContainer);

    let rollsCount = 0;
    let totalScore = 0;
    let catImageCount = 0;
    let interval;

    startButton.addEventListener('click', () => {
        startButton.disabled = true;
        stopButton.style.display = 'block';
        interval = setInterval(() => {
            const roll1 = Math.floor(Math.random() * 6) + 1;
            const roll2 = Math.floor(Math.random() * 6) + 1;
            rollsCount++;
            totalScore += roll1 + roll2;

            dice1.textContent = roll1;
            dice2.textContent = roll2;
            rolls.textContent = rollsCount;
            score.textContent = totalScore;

            if ((roll1 + roll2) % 2 === 0) {
                fetch('https://api.thecatapi.com/v1/images/search?limit=10') // Fetch 10 images at once
                    .then(response => response.json())
                    .then(data => {
                        catContainer.innerHTML = ''; // Clear previous cats
                        data.forEach(cat => {
                            const catImage = document.createElement('img');
                            catImage.src = cat.url;
                            catImage.classList.add('cat-image');
                            catImage.style.top = `${Math.random() * 80 + 10}%`; // Randomly position between 10% and 90% of the height
                            catImage.style.left = `${Math.random() * 80 + 10}%`; // Randomly position between 10% and 90% of the width
                            catContainer.appendChild(catImage);
                        });
                        catImageCount += data.length;
                        catCount.textContent = catImageCount;
                        catAverage.textContent = (catImageCount / rollsCount).toFixed(2);
                    })
                    .catch(error => console.error('Error fetching cat image:', error));
            } else {
                catContainer.innerHTML = ''; // Clear cats if the roll isn't even
                catAverage.textContent = (catImageCount / rollsCount).toFixed(2);
            }
        }, 1000); // Adjust the interval time as needed
    });

    stopButton.addEventListener('click', () => {
        clearInterval(interval);
        startButton.disabled = false;
        stopButton.style.display = 'none';
    });
});
