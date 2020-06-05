let Upload = {

    render : async () => {
        let view =  /*html*/`
        	<section class="load-new-songs-section-container">
			<h2 class="sections-text" id="MusicGenre">Загрузка песен</h2>
			<p class="description-text">
				Загрузите свой трек, выбрав нужный файл и вписав название песни и исполнителя.
			</p>
			<label for="name-input" class="load-new-song-text-help">Название песни:</label>
            <input id="name-input-i" type="text" class="load-new-song-input" placeholder="Введите название песни">
            <label for="author-input" class="load-new-song-text-help">Имя исполнителя:</label>
            <input id="author-input-i" type="text" class="load-new-song-input" placeholder="Введите исполнителя">

            <div class="div-load-file">
                <label class="btn-red-load-file" id="label-load-file-button">Загрузить песню
                    <input type='file' accept=".mp3" value="upload" id="load-file-button">
                </label>
                <p id="file-name" class="load-link"></p>
            </div>

            <p class="load-new-song-text-help">Выберите жанр:</p>

            <ul id=ul-chose-genre>
                <li class="li-chose-genre">
                    <input type="radio" name="genre-radio" value="rock" class="chose-genre-item" id="chose-genre-item1">
                    <label for="chose-genre-item1" class="chose-genre-label">Rock</label>
                </li>
                <li class="li-chose-genre">
                    <input type="radio" name="genre-radio" value="hip-hop" class="chose-genre-item" id="chose-genre-item2">
                    <label for="chose-genre-item2" class="chose-genre-label">Hip-hop</label>
                </li>
                <li class="li-chose-genre">
                    <input type="radio" name="genre-radio" value="electronic" class="chose-genre-item" id="chose-genre-item3">
                    <label for="chose-genre-item3" class="chose-genre-label">Electronic</label>
                </li>
                <li class="li-chose-genre">
                    <input type="radio" name="genre-radio" value="folk" class="chose-genre-item" id="chose-genre-item4">
                    <label for="chose-genre-item4" class="chose-genre-label">Folk</label>
                </li>
                <li class="li-chose-genre">
                    <input type="radio" name="genre-radio" value="pop" class="chose-genre-item" id="chose-genre-item5">
                    <label for="chose-genre-item5" class="chose-genre-label">Pop</label>
                </li>
                <li class="li-chose-genre">
                    <input type="radio" name="genre-radio" value="classic" class="chose-genre-item" id="chose-genre-item6">
                    <label for="chose-genre-item6" class="chose-genre-label">Classic</label>
                </li>
            </ul>

            <button id="load-button" class="btn-red-upload">Загрузить песню</button>

		</section>
        `
        return view
        },
        after_render: async () => {


        const fileButton = document.getElementById('load-file-button');
        const uploadButton = document.getElementById('load-button');
        const fileName = document.getElementById('file-name');
        const nameInput = document.getElementById('name-input-i');
        const authorInput = document.getElementById('author-input-i');

        const snapshot = await firebase.database().ref('/songs_count/id').once('value');
        const songId = snapshot.val();

        function pushSongId(id) {
            firebase.database().ref('/songs_count').set({ id });
        }

        let file = null;

        fileButton.addEventListener('change', (event) => {
            file = event.target.files[0];
            fileName.innerHTML = file.name;
        });

        uploadButton.addEventListener('click', e=>{
            if (!nameInput.value || !authorInput.value){
                alert("All fields must be provided!");
            }else if (file){
                let storageRef = firebase.storage().ref('mp3/' + nameInput.value + " - " + authorInput.value + '.mp3');
                storageRef.put(file);
                pushSongId(songId + 1);

                const rbs = document.querySelectorAll('input[name="genre-radio"]');
                let selectedValue = 'none';
                for (const rb of rbs) {
                    if (rb.checked) {
                        selectedValue = rb.value;
                        break;
                    }
                }
                console.log(selectedValue);

                firebase.database().ref('song/' + songId).set({
                    name: nameInput.value,
                    author: authorInput.value,
                    genre: selectedValue
                }, function(error) {
                    if (error) {
                        alert(error.message);
                    } else {
                        console.log('data saved succsessfully!');
                    }
                });

                document.location.href = "/#/";
            } else {
                alert("No file selected..");
            }
        });
        }
    }

export default Upload;
