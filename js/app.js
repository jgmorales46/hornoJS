let estadoHorno = 'apagado', videoHornoActual, puertaHorno, puertaBloqueada = false;

window.onload = () => {
    videoHornoActual = document.getElementById('video-horno');
    puertaHorno = document.getElementById('puerta-horno')

    puertaHorno.onclick = () => {
        if(!puertaBloqueada) {
            
            if(estadoHorno == 'tarta-lista') {
                estadoHorno = 'retirar-lista';
            } else if (estadoHorno == 'tarta-quemada') {
                estadoHorno = 'retirar-quemada';
            }
            avanzarAnimacion();
        }
    }

    function avanzarAnimacion(){
        console.log(estadoHorno);
        switch (estadoHorno) {
            case 'apagado':
                reproducirSonido('puerta', false);
                bloquearPuerta(true);
                mostrarVideo();
                reproducirVideo('horno-abriendo-puerta');
                cuandoTerminaAvanzarA('cocinando');
                break;

            case 'cocinando':
                reproducirVideo('horno-cocinando');
                reproducirSonido('timer', true);
                rotarPerilla(20);
                cuandoTerminaAvanzarA('tarta-lista');
                break;

            case 'tarta-lista' :
                detenerSonido();
                bloquearPuerta(false);
                reproducirVideo('horno-tarta-lista');
                reproducirSonido('campanita', false)
                loopear(10000);
                cuandoTerminaAvanzarA('tarta-quemandose');
                break;

            case 'tarta-quemandose' :
                detenerSonido();
                bloquearPuerta(true);
                reproducirVideo('horno-tarta-quemandose');
                cuandoTerminaAvanzarA('tarta-quemada');
                break;

            case 'tarta-quemada' :
                bloquearPuerta(false);
                reproducirVideo('horno-tarta-quemada');
                loopear()
                break;

            case 'retirar-lista':
                reproducirSonido('puerta-con-tarta', false);
                bloquearPuerta(true);
                reproducirVideo('horno-retirar-lista');
                reiniciar();
                break;

            case 'retirar-quemada':
                reproducirSonido('puerta-con-tarta', false);
                bloquearPuerta(true);
                reproducirVideo('horno-retirar-quemada');
                reiniciar();
                break;

            default:
                break;
        }
    }

    function cuandoTerminaAvanzarA(estado) {
        videoHornoActual.onended = () => {
            actualizarEstadoA(estado);
            avanzarAnimacion();
        }
    }

    function actualizarEstadoA(estado){
        estadoHorno = estado;
    }

    function bloquearPuerta(traba) {
        puertaBloqueada = traba;
    }

    function reproducirVideo(nombreVideo) {
        videoHornoActual.src = `video/${nombreVideo}.webm`;
        videoHornoActual.play();
    }

    function loopear(time) {
        videoHornoActual.loop = true;
        
        if(time != undefined ) {
            setTimeout(() => {
                desLoopear();
            }, 10000);
        }
        
    }

    function desLoopear(){
        videoHornoActual.loop = false;
    }

    function reiniciar() {
        desLoopear();
        videoHornoActual.onended = () => {
            actualizarEstadoA('apagado');
            ocultarVideo();
            bloquearPuerta(false);
            rotarPerilla(0);
        }
    }

    function mostrarVideo() {
        videoHornoActual.classList.remove('hidden');
    }

    function ocultarVideo() {
        videoHornoActual.classList.add('hidden');
    }

    const MAX_PLAYBACK_RATE = 16, MIN_PLAYBACK_RATE = 1;
    let perillaHorno = document.getElementById('perilla-horno'), rotacionPerilla = 0;

    perillaHorno.onmousewheel = (e) => {
        if (estadoHorno == 'cocinando' || estadoHorno == 'tarta-lista'){
            cambiarTemperatura(e);
        }
    }

    function cambiarTemperatura(e) {
        if (e.deltaY < 0 && videoHornoActual.playbackRate < MAX_PLAYBACK_RATE) {
            rotarPerilla('derecha');
            videoHornoActual.playbackRate = videoHornoActual.playbackRate + 0.5;
        } else if (e.deltaY > 0 && videoHornoActual.playbackRate > MIN_PLAYBACK_RATE) {
            rotarPerilla('izquierda');
            videoHornoActual.playbackRate = videoHornoActual.playbackRate - 0.5;
        }
    }

    function rotarPerilla(direccion) {
        if (direccion === 'derecha') {
            rotacionPerilla = rotacionPerilla + 2.5;
        } else if (direccion === 'izquierda') {
            rotacionPerilla = rotacionPerilla - 2.5;
        } else {
            rotacionPerilla = direccion;
        }
        perillaHorno.style.transform = `rotate(${rotacionPerilla}deg)`;
    }

    let sonido;

    function reproducirSonido(nombreSonido, loopearSonido) {
        sonido = new Audio(`audio/${nombreSonido}.mp3`);
        sonido.play();
        sonido.loop = loopearSonido;
    }

    function detenerSonido() {
        sonido.pause();
    }

}