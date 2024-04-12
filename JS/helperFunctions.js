/** NOT CURRENTLY USED  MAY REMOVE LATER ***/

/**
 *    Get latitude and longitude
 */
async function getDefaultLatLong()
{
 

    const successCallback = (position) => {
        console.log("Position");
        console.log(position);
        const { coords } = position;
        defaultLocation.latitude = coords.latitude;
        defaultLocation.longitude = coords.longitude;
        return position;
        
      };
      
      const errorCallback = (error) => {
        console.log(error);
        return error;
      };
      
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  
}

/**
 *  convertKMtoMP
 */
function convertKMtoMPH(valNum) {

    let result = valNum/1.609344

    result = Math.round(result);


    return result;
  
}

/**
 * getFahrenheitFromCelsius
 * @param {} celsius 
 * @returns 
 */
function getFahrenheitFromCelsius(celsius){

 
    let farCalc = (celsius * (9/5)) + 32;

    let farTemp = Math.round(farCalc);

    return farTemp;
}