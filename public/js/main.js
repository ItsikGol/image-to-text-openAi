function onSubmit(e) {
  e.preventDefault();

  document.querySelector('.msg').textContent = '';
  document.querySelector('#image').src = '';
  document.querySelector('#text-tr').textContent ='';

  const prompt = document.querySelector('#prompt').value;

  if (prompt === '') {
    alert('Please add some text');
    return;
  }

  generateImageRequest(prompt);
}

async function generateImageRequest(prompt) {
  try {
    showSpinner();

    const response = await fetch('/openai/generateimage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      removeSpinner();
      throw new Error('That image could not be generated');
    }

    const { data, text } = await response.json();
    document.querySelector('#image').src = data;
    document.querySelector('#text-tr').textContent = text;

    removeSpinner();
  } catch (error) {
    document.querySelector('.msg').textContent = error;
  }
}

function showSpinner() {
 document.querySelector('.loader').classList.add('show');
}

function removeSpinner() {
  document.querySelector('.loader').classList.remove('show');
}

document.querySelector('#image-form').addEventListener('submit', onSubmit);
