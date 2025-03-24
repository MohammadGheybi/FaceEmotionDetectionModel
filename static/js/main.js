const dropZone = document.getElementById('dropZone');
const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const predictBtn = document.getElementById('predictBtn');
const result = document.getElementById('result');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Handle drop zone styling
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
        dropZone.classList.add('dragover');
    });
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
        dropZone.classList.remove('dragover');
    });
});

// Handle dropped files
dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
        imageInput.files = files; // Transfer the file to the input element
        handleFiles(files[0]); // Handle the dropped file
    }
});

// Handle click upload
dropZone.addEventListener('click', () => imageInput.click());

// Handle file input change
imageInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFiles(e.target.files[0]);
    }
});

// Handle the file (both for drop and select)
function handleFiles(file) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'inline-block';
            predictBtn.disabled = false; // Enable the predict button
        }
        reader.readAsDataURL(file);
    }
}

async function predictEmotion() {
    const file = imageInput.files[0];
    if (!file) {
        alert('Please select an image first');
        return;
    }

    try {
        // Show loading state
        predictBtn.disabled = true;
        predictBtn.textContent = 'Analyzing...';
        result.style.display = 'none';

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch('/predict', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Prediction result:', data); // Debug log

        // Display the result
        result.innerHTML = `
            <div style="padding: 15px; background-color: #f0f9ff; border-radius: 8px; border: 1px solid #bae6fd;">
                <h3 style="color: #0369a1; margin-bottom: 10px;">Analysis Result</h3>
                <p style="margin: 5px 0;"><strong>Emotion:</strong> ${data.emotion}</p>
                <p style="margin: 5px 0;"><strong>Confidence:</strong> ${(data.confidence * 100).toFixed(2)}%</p>
            </div>
        `;
        result.style.display = 'block';

    } catch (error) {
        console.error('Error:', error); // Debug log
        result.innerHTML = `
            <div style="padding: 15px; background-color: #fef2f2; border-radius: 8px; border: 1px solid #fecaca;">
                <p style="color: #dc2626;">Error analyzing image. Please try again.</p>
            </div>
        `;
        result.style.display = 'block';
    } finally {
        // Reset button state
        predictBtn.disabled = false;
        predictBtn.textContent = 'Analyze Emotion';
    }
}

// Add click event listener to the predict button
document.addEventListener('DOMContentLoaded', () => {
    predictBtn.addEventListener('click', predictEmotion);
});