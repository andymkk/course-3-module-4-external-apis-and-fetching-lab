// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!


const stateInput = document.getElementById('state-input');
const fetchButton = document.getElementById('fetch-alerts');
const alertsDisplay = document.getElementById('alerts-display');
const errorMessageDiv = document.getElementById('error-message');

async function fetchWeatherAlerts(state) {
    hideError();
    
    if (!state || state.trim() === '') {
        showError('Please enter a state abbreviation.');
        return null;
    }
    
    const stateAbbr = state.trim().toUpperCase();
    
    if (stateAbbr.length !== 2) {
        showError('Please enter a valid 2-letter state abbreviation.');
        return null;
    }
    
    try {
        showLoading(true);
        
        const response = await fetch(`${weatherApi}${stateAbbr}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch alerts for ${stateAbbr}. Status: ${response.status}`);
        }
        
        const data = await response.json();
        showLoading(false);
        return data;
    } catch (error) {
        showLoading(false);
        showError(error.message);
        console.error('Fetch error:', error);
        return null;
    }
}

function displayAlerts(data) {
    alertsDisplay.innerHTML = '';
    
    if (!data || !data.features || data.features.length === 0) {
        alertsDisplay.innerHTML = '<p>No active weather alerts for this state.</p>';
        return;
    }
    
    let titleText = data.title || `Current watches, warnings, and advisories for ${stateInput.value.trim().toUpperCase()}`;
    
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'alert-summary';
    summaryDiv.innerHTML = `<h2>${titleText}: ${data.features.length}</h2>`;
    alertsDisplay.appendChild(summaryDiv);
    
    const alertsList = document.createElement('ul');
    alertsList.className = 'alerts-list';
    
    data.features.forEach(alert => {
        if (alert.properties && alert.properties.headline) {
            const listItem = document.createElement('li');
            listItem.className = 'alert-item';
            listItem.textContent = alert.properties.headline;
            alertsList.appendChild(listItem);
        }
    });
    
    alertsDisplay.appendChild(alertsList);
}

function clearInput() {
    stateInput.value = '';
}

function showError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.classList.remove('hidden');
}

function hideError() {
    errorMessageDiv.textContent = '';
    errorMessageDiv.classList.add('hidden');
}

function showLoading(isLoading) {
    if (isLoading) {
        fetchButton.disabled = true;
        fetchButton.textContent = 'Loading...';
    } else {
        fetchButton.disabled = false;
        fetchButton.textContent = 'Get Weather Alerts';
    }
}

async function handleFetchAlerts() {
    const state = stateInput.value;
    
    alertsDisplay.innerHTML = '';
    hideError();
    
    const alertData = await fetchWeatherAlerts(state);
    
    if (alertData) {
        displayAlerts(alertData);
        clearInput();
    }
}

fetchButton.addEventListener('click', handleFetchAlerts);

stateInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleFetchAlerts();
    }
});