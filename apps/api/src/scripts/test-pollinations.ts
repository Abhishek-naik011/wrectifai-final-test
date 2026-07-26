async function testPollinations() {
  try {
    const prompt = 'photorealistic 2018 chevrolet cruze front three quarter angle white background studio lighting';
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true&enhance=true`;
    console.log('Fetching:', url);
    const response = await fetch(url);
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));
    if (response.ok) {
        console.log('Success!');
    }
  } catch (err) {
    console.error('Failed:', err);
  }
}

testPollinations();
