import './style.css';

const setupSubscribeButton = (element) => {

  console.log('Setting up subscribe button');
  element.addEventListener('submit', async(event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    if(email === '' || email === null) {
      alert('Email is required');
      return;
    }
    console.log('Subscribing', email);

    const res = await fetch('https://65f335d0163e397c95de.appwrite.global', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ 
        email: email
      }),
    });

    console.log('Subscribed', res.status);
  });
}

document.querySelector('#app').innerHTML = `
  <div>
    <section>
      <div class="newsletter-box">
        <h2>Scratch Newsletter</h2>
        <form action="" id="subscribe">
          <input type="text" id="email" name="email" placeholder="Email" />
          <button type="submit" onClick()=>Subscribe</button>
        </form>
      </div>
    </section>
  </div>
`

setupSubscribeButton(document.querySelector('#subscribe'));