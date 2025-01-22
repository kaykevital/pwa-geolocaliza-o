//registrando a service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      let reg;
      reg = await navigator.serviceWorker.register('/sw.js', { type: "module" });

      console.log('Service worker registrada! 😎', reg);
    } catch (err) {
      console.log('😥 Service worker registro falhou: ', err);
    }
  });
}

let posicaoInicial; //Variavel para capturar a posição
const capturarLocalizacao = document.getElementById('localizacao');
const latitude = document.getElementById('latitude');
const longitude = document.getElementById('longitude');

const sucesso = (posicao) => {//calback de sucesso para captura da posição
  posicaoInicial = posicao;
  latitude.innerHTML = posicaoInicial.coords.latitude;
  longitude.innerHTML = posicaoInicial.coords.longitude;
};

atualizarMapa.onclick = function() {
  const latitudeMapa = document.getElementById('latitudeMapa').value.trim();
  const longitudeMapa = document.getElementById('longitudeMapa').value.trim();

  if (latitudeMapa && longitudeMapa && !isNaN(latitudeMapa) && !isNaN(longitudeMapa)) {
    const iframe = document.getElementById('gmap_canvas');
    const baseURL = 'https://maps.google.com/maps';
    const query = `?q=${latitudeMapa},${longitudeMapa}&t=&z=19&ie=UTF8&iwloc=&output=embed`;
    iframe.src = baseURL + query;
  } else {
    alert('Por favor, insira valores válidos de latitude e longitude!');
  }
}

const erro = (error) => { //callback de error (falha para captura de localização) 
  let errorMessage;
  switch (error.code) {
    case 0:
      errorMessage = "Erro desconhecido"
      break;
    case 1:
      errorMessage = "Permissão negada!"
      break;
    case 2:
      errorMessage = "Captura de posição indisponivel!"
      break;
    case 3:
      errorMessage = "Tempo de solicitação exedido!"
      break;
  }
  console.log('Ocorreu um erro: ' + errorMessage);
};

capturarLocalizacao.addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(sucesso, erro);
});
