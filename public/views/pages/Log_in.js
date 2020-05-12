let Log_in = {

    render : async () => {
        let view =  /*html*/`
          <form class='form-authentication'>
      			<div>
      				<h1 class="auth-text">Авторизация</h1>
      				<div class="div-flex-auth">
      					<div class="div-help-auth-text">
      						<p class="">Логин</p>
      						<input id='email_input' type="email" placeholder="Введите email">
      					</div>
      					<div class="div-help-auth-text">
      						<p>Пароль</p>
      						<input id='pass_input' type="password" placeholder="Введите пароль">
      					</div>
      					<div class="div-button-auth">
      						<button id='log_in_submit_btn' class="btn-red div-button-auth">Войти</button>
      					</div>
      				</div>
      			</div>
      		<form>
        `
        return view
    }
    , after_render: async () => {
      document.getElementById('page_container').className = 'main-authentication';

      const txtEmail = document.getElementById("email_input");
      const txtPass = document.getElementById("pass_input");
      const btnSignUp = document.getElementById("log_in_submit_btn")

      btnSignUp.addEventListener ("click", e => {
        event.preventDefault();
        const email = txtEmail.value;
        const pass = txtPass.value;

        if (email =='' | pass == '') {
          alert (`The fields cannot be empty`);
        }
        else {
          firebase.auth().signInWithEmailAndPassword(email, pass)
            .then(function(regUser){
              window.location.href = '/';
              alert(`User ${email} was successfully signed in!`);
            }).catch(function(error){
              alert(error.message);
            });
        }
      });
    }
}
export default Log_in;
