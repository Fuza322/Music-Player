let Registration = {

    render: async () => {
        return /*html*/ `
            <form class='form-authentication'>
                <div>
                    <h1 class="auth-text">Регистрация</h1>
                    <div class="div-flex-auth">
                        <div class="div-help-auth-text">
                            <p>E-mail</p>
                            <input id='email_input' type="email" placeholder="Введите e-mail">
                        </div>
                        <div class="div-help-auth-text">
                            <p>Пароль</p>
                            <input id='password_input' type="password" placeholder="Введите пароль">
                            <br>
                            <input id='repeat_password_input' type="password" placeholder="Повторите пароль">
                        </div>
                        <div class="div-button-auth">
                            <button id='registration_submit_btn' class="btn-red">Создать аккаунт</button>
                        </div>
                    </div>
                </div>
            </form>
        `
    }
    , after_render: async () => {
        document.getElementById('page_container').className = 'main-authentication';

        const txtEmail       = document.getElementById("email_input");
        const txtPass        = document.getElementById("password_input");
        const txtRepeatPass  = document.getElementById("repeat_password_input");
        const regSubmitBtn   = document.getElementById("registration_submit_btn");

        regSubmitBtn.addEventListener ("click",  () => {
          event.preventDefault();
          let email       = txtEmail.value;
          let pass        = txtPass.value;
          let repeatPass  = txtRepeatPass.value;
          if (pass != repeatPass) {
              alert (`The passwords dont match`)
          } else if (email =='' | pass == '' | repeatPass == '') {
              alert (`The fields cannot be empty`)
          }
          else {
            firebase.auth().createUserWithEmailAndPassword(email, pass)
              .then(async function(regUser){
                  const snapshot = await firebase.database().ref('/user_count/id').once('value');
                  let lastUser = snapshot.val();
                  await firebase.database().ref("/play_queue/" + lastUser).set({ user : email});
                  await firebase.database().ref('/user_count/id').set(lastUser + 1);
                window.location.href = '/#/';
                alert(`User ${email} was successfully created!`);
              }).catch(function(error){
                alert(error.message);
              });
          }
        });
    }
}

export default Registration;
