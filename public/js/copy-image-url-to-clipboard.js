async function copyImageUrl() {
    // 1. Get the image element and its full URL
    const imgElement = document.getElementById('myImage');
    const imageUrl = imgElement.src;
    const button = document.getElementById('copyBtn');

    try {
      // 2. Write the URL to the user's clipboard
      await navigator.clipboard.writeText(imageUrl);

      // 3. Optional: Provide immediate visual feedback
      button.innerText = 'Copied!';
      setTimeout(() => {
        button.innerText = 'Copy Image URL';
      }, 2000);

    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Could not copy URL. Please copy it manually.');
    }
  }