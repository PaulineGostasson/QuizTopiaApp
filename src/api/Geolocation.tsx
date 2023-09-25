import { Coord } from '../interfaces';

export async function getPosition(): Promise<Coord>{
    return new Promise((resolve, reject)=>{
        if ('geolocation' in navigator){
            const geo = navigator.geolocation;
            geo.getCurrentPosition(
                pos => {
                const position: Coord = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                }
                sessionStorage.setItem('latitude', position.latitude.toString());
                sessionStorage.setItem('longitude', position.longitude.toString());

                resolve(position)
                console.log(position)
            }, error=>{
                reject(error.message)
                console.log('location is not on', error)
            })
        } else{
            reject('Please upgrade your browser to use this app')
        }
    })
}