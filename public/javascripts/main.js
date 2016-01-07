function toggleDevice(deviceId) {
    $.post( '/api/devices/' + deviceId, function(data) {
       location.reload();
    });
}