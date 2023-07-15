function sendPlayerPoints() {
  var playerName = "Bob";
  var points = 10;

  var data = {
    playerName: playerName,
    points: points
  };

  fetch('/send-playerpoints', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(function(response) {
    if (response.ok) {
      console.log('Permintaan berhasil');
    } else {
      console.log('Terjadi kesalahan');
    }
  })
  .catch(function(error) {
    console.log('Terjadi kesalahan:', error);
  });
}

// Contoh pemanggilan fungsi sendPlayerPoints()
sendPlayerPoints();