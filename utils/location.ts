interface OSMLocation {
  addresstype?: string,
  boundingbox?: string[],
  class?: string,
  display_name?: string,
  importance?: number
  lat?: number,
  licence?: string,
  lon?: string
  name?: string,
  osm_id?: number,
  osm_type?: string,
  place_id?: number,
  place_rank?: number, 
  type?: string
}

export async function getCoordinetesByLocation(street: string, city: string) {

  try {
    const res = await $fetch<OSMLocation[]>(`https://nominatim.openstreetmap.org/search?street=${street}&city=${city}&format=json`, {
      method: 'GET'
    })

    if( !res.length ) {
      return false
    }

    return {
      lon: res[0].lon,
      lat: res[0].lat,
      place_id: res[0].place_id
    }

  } catch (error) {
    console.error(error)
    return false
  }

}