"use strict";

import Index            from './views/pages/Index.js'
import Error404         from './views/pages/Error404.js'
import Registration     from './views/pages/Registration.js'
import Log_in           from './views/pages/Log_in.js'
import Genre            from './views/pages/Genre.js'
import Artist           from './views/pages/Artist.js'
import Playlist         from './views/pages/Playlist.js'
import PlaylistNew      from './views/pages/PlaylistNew.js'

import Header           from './views/components/Header.js'
import Footer           from './views/components/Footer.js'
import Navbar           from './views/components/Navbar.js'
import MusicPlayer      from './views/components/MusicPlayer.js'

import Utils            from './services/Utils.js'

// List of supported routes. Any url other than these routes will throw a 404 error
const routes = {
    '/'                 : Index
    , '/registration'   : Registration
    , '/log_in'         : Log_in
    , '/genres/:id'     : Genre
    , '/artists/:id'    : Artist
    , '/playlists/:id'  : Playlist
    , '/playlist'       : PlaylistNew
};


// The router code. Takes a URL, checks against the list of supported routes and then renders the corresponding content page.
const router = async () => {

    // Lazy load view element:
    const header = null || document.getElementById('header_container');
    const content = null || document.getElementById('page_container');
    const footer = null || document.getElementById('footer_container');

    // Render the Header and footer of the page
    header.innerHTML = await Header.render();
    await Header.after_render();
    footer.innerHTML = await Footer.render();
    await Footer.after_render();


    // Get the parsed URl from the addressbar
    let request = Utils.parseRequestURL()

    // Parse the URL and if it has an id part, change it with the string ":id"
    let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '')

    // Get the page from our hash of supported routes.
    // If the parsed URL is not in our list of supported routes, select the 404 page instead
    let page = routes[parsedURL] ? routes[parsedURL] : Error404
    content.innerHTML = await page.render();

    const navigation = null || document.getElementById('navbar');
    const musicPlayer = null || document.getElementById('musicplayer');
    if (navigation){
      navigation.innerHTML = await Navbar.render();
    }
    if (musicPlayer){
      musicPlayer.innerHTML = await MusicPlayer.render();
    }

    await page.after_render();
    await MusicPlayer.after_render();

}

// Listen on hash change:
window.addEventListener('hashchange', router);

// Listen on page load:
window.addEventListener('load', router);
