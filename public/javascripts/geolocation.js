window.geolocateMe = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      geo => {
        console.log("Geolocated!");
        resolve(geo);
      },
      e => {
        console.error(e);
        reject(e);
      }
    );
  });
};
