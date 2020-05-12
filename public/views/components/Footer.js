let Footer = {
    render: async () => {
        let view =  /*html*/`
          <nav class="footer-nav">
              <p class="footer-title-text">Навигация</p>
              <ul class="ul-footer-text" type="circle">
                  <li><a class="footer-nav-text" href="#CreatePlaylist">Создать плейлист</a></li>
                  <li><a class="footer-nav-text" href="#MusicGenre">Музыкальные жанры</a></li>
                  <li><a class="footer-nav-text" href="#MusicArtists">Исполнители</a></li>
                  <li><a class="footer-nav-text" href="#Feedback">Обратная связь</a></li>
              </ul>
          </nav>
          <div>
              <div class="feedback-container">
                  <p class="footer-title-text" id="Feedback">Обратная связь:</p>
                  <p class="footer-text"> Есть вопросы или предложения? <br>
                      Мы с радостью вас выслушаем!
                  </p>
              </div>
          </div>
          <div>
            <div class="feedback-container">
              <p class="footer-title-text">Почта:</p>
              <p class="footer-text"><a href="mailto:vanya.osipik322@gmail.com">vanya.osipik322@gmail.com</a><p>
              <p class="footer-title-text">Контактный телефон:</p>
              <p class="footer-text"><a href="tel:+375291391582">+375 (29)-139-15-82</a></p>
            </div>
          </div>
          <a id="hide-logo-footer" href="index.html">
              <div>
                  <img id="logo-size-footer" src="assets/images/footerLogo.jpg" alt="Logo">
              </div>
          </a>
        `
        return view
    },
    after_render: async () => {
    }

}

export default Footer;
