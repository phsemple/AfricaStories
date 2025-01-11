
export default class AudioHandler {

    constructor()
    {
        this.audio = document.querySelector('#audio');
        this.playing = false;
        this.playbutton = document.getElementById('playbutton');
        this.playImg = this.playbutton.querySelector('img')
        this.pausebutton = document.getElementById('pausebutton');
        this.pauseImg = this.pausebutton.querySelector('img')

        this.forward = document.querySelector('#forward');
        this.back = document.querySelector('#back');

        this.addEventListeners();
    }

    addEventListeners() {
        this.playbutton.addEventListener('click', this.playpause.bind(this));
        this.pausebutton.addEventListener('click', this.playpause.bind(this));
        this.forward.addEventListener('click', this.skipForward.bind(this));
        this.back.addEventListener('click', this.skipBack.bind(this));

        this.audio.addEventListener('play', this.play.bind(this));
        this.audio.addEventListener('pause', this.pause.bind(this));
        this.audio.addEventListener('ended', this.end.bind(this)); 
    }

    play()
    {
        this.playing = true;
        this.togglePlayPause();
    }
    
    pause()
    {
        this.playing = false;
        this.togglePlayPause();
    }

       /* toggle the playpause when onended is triggered */
    end()
    {   
        this.playing = false;
        this.togglePlayPause();
    }


    isAudioPlaying() {
        return !this.audio.paused &&
            !this.audio.ended &&
            this.audio.readyState > 2;
    }

    stopPlaying() /* if the text is playing, stop it and reset */
    {
        if (this.playing) {
            this.playing = false;
            this.audio.currentTime = 0; // Set the audio back to the start
            this.playpause();
        }
    }

    /* we toggle visibility on both the button and the image. We decide based on 
        the this.playing boolean, since toggling on hidden/visible causes problems
        if button is pushed at the wrong time. */
    togglePlayPause() {

        if (this.playing) {
            this.playbutton.classList.remove('visible');
            this.playbutton.classList.add('hidden');
            this.pausebutton.classList.remove('hidden');
            this.pausebutton.classList.add('visible');

            this.playImg.classList.remove('visible');
            this.playImg.classList.add('hidden');
            this.pauseImg.classList.remove('hidden');
            this.pauseImg.classList.add('visible');
        } else {
            this.playbutton.classList.remove('hidden');
            this.playbutton.classList.add('visible');
            this.pausebutton.classList.remove('visible');
            this.pausebutton.classList.add('hidden');

            this.playImg.classList.remove('hidden');
            this.playImg.classList.add('visible');
            this.pauseImg.classList.remove('visible');
            this.pauseImg.classList.add('hidden');
        }
    }

    playpause() {
        if (this.audio.paused) {
            this.audio.play();
            this.playing = true;
        } else {
            this.audio.pause();
            this.playing = false;
        }
        this.togglePlayPause();
    }

    skipBack() {
        if (this.isAudioPlaying()) {
            this.audio.currentTime -= 2; 
        }
    }

    skipForward() {
        if (this.isAudioPlaying()) {
            this.audio.currentTime += 2;
        }
    }

    setPlaybackRate(rate) {
        this.audio.playbackRate = Number(rate);
    }

    setAutoplay(state) {
        state ? this.audio.setAttribute('autoplay', true) : this.audio.removeAttribute('autoplay');
    }
}