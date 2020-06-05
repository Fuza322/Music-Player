let Header = {
    render: async () => {
        let view =  /*html*/`
            <a href="/#/">
                <div id="logo-div-flex">
                    <img id="logo-size-header" src="assets/images/headerLogo.jpg" alt="Logo">
                    <div id="div-music-player-name">Play Music</div>
                </div>
            </a>
            <div id="block-auth-buttons">
                <a id='log_out_btn' href="#"><div class="div-header-logout-button"><img class="logout-button-img-size" src="assets/images/logout.png" alt="logout"></div></a>
                <a id='log_in_btn' href="/#/log_in" class="header-ref-button"><div class="div-header-buttons"><p>Вход</p></div></a>
                <a href="/#/registration" class="header-ref-button"><div class="div-header-buttons"><p>Регистрация</p></div></a>
            </div>
        `
        return view
    },
    after_render: async () => {
      const btnLogOut = document.getElementById("log_out_btn");
      const btnLogIn = document.getElementById('log_in_btn');

      btnLogOut.addEventListener('click', e => {
        firebase.auth().signOut()
          .then(function(){
            alert('signed out successfully');
          }).catch(function(error){
            alert(error.message);
          });
      });

      firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser){
          btnLogIn.style.display = 'none';
          btnLogOut.style.display = 'block';
        } else {
          btnLogIn.style.display = 'block';
          btnLogOut.style.display = 'none';
        }
      });
    }

}

export default Header;
