import axios from "axios";
import FetchPhoto from "./GetPhoto.js";
async function SearchNearBy(lat, lon, radius = 10000, type = "tourist_attraction", maxResults = 6) {
    const option = {
        method: "POST",
        url: 'https://google-map-places-new-v2.p.rapidapi.com/v1/places:searchNearby',
        headers: {
            'x-rapidapi-key': process.env.RAPID_API_for_searchNearBY,
            'x-rapidapi-host': 'google-map-places-new-v2.p.rapidapi.com',
            'Content-Type': 'application/json',
            'X-Goog-FieldMask': '*'
        },
        data: {
            includedTypes: Array.isArray(type) ? type : [type],
            maxResultCount: maxResults,
            locationRestriction: {
                circle: {
                    center: { latitude: lat, longitude: lon },
                    radius: radius
                }
            },
            rankPreference: 0
        }
    };

    try {
        const response = await axios.request(option);
        const places = response.data.places || [];
        const formattedPlaces = await Promise.all(
            places.map(async (place) => {
                const formatted = ProperFormat(place);
                if (place.photos && place.photos.length > 0) {
                    const { placeId, photoName } = extractPlaceIdAndPhotoName(place.photos[0].name);
                    const photo = await FetchPhoto(placeId, photoName, process.env.RAPID_API_FOR_placePhoto1);
                    formatted.originalPhoto = photo?.photoUri || null;
                    await wait(1500);
                } else {
                    formatted.originalPhoto = null;
                }
                return formatted;
            })
        );
        return formattedPlaces;
    } catch (error) {
        console.error('Error fetching places:', error?.response?.data || error.message);
        return [];
    }
}
export default SearchNearBy;

function extractPlaceIdAndPhotoName(fullName) {
    const parts = fullName.split("/");
    return {
        placeId: parts[1],
        photoName: parts[3],
    };
}

function ProperFormat(place) {
    return {
        id: place.id,
        types: place.types,
        displayName: place.displayName?.text || '',
        address: place.shortFormattedAddress || place.formattedAddress,
        location: place.location,
        rating: place.rating,
        isOpen: place.currentOpeningHours?.openNow,
        reviews: place.reviews,
        phone: place.nationalPhoneNumber,
        mapUrl: place.googleMapsUri,
        openingHours: place.regularOpeningHours?.weekdayDescriptions,
        editorialSummary: place.editorialSummary?.text,
        goodForChildren: place.goodForChildren,
        addressDescriptor: place.addressDescriptor,
        googleMapsLinks: place.googleMapsLinks
    };
}

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

//  Travel & Attractions

// | Type                 | Description                  |
// | -------------------- | ---------------------------- |
// | `tourist_attraction` | Landmarks, attractions, etc. |
// | `museum`             | Museums                      |
// | `art_gallery`        | Art galleries                |
// | `zoo`                | Zoos                         |
// | `aquarium`           | Aquariums                    |
// | `park`               | Parks, gardens               |
// | `campground`         | Camping sites                |
// | `amusement_park`     | Theme parks                  |


//hotel and resort

// | Type          | Description           |
// | ------------- | --------------------- |
// | `lodging`     | Hotels, resorts       |
// | `hotel`       | Hotels (if separated) |
// | `hostel`      | Hostels               |
// | `guest_house` | Guest houses          |

//shopping
// | Type                | Description        |
// | ------------------- | ------------------ |
// | `shopping_mall`     | Malls              |
// | `clothing_store`    | Fashion outlets    |
// | `supermarket`       | Supermarkets       |
// | `convenience_store` | Convenience stores |
// | `book_store`        | Bookstores         |


///services
// | Type          | Description     |
// | ------------- | --------------- |
// | `atm`         | ATMs            |
// | `pharmacy`    | Pharmacies      |
// | `hospital`    | Hospitals       |
// | `police`      | Police stations |
// | `bank`        | Banks           |
// | `post_office` | Post offices    |

// transposrt
// | Type             | Description           |
// | ---------------- | --------------------- |
// | `gas_station`    | Petrol stations       |
// | `train_station`  | Train stations        |
// | `bus_station`    | Bus stops             |
// | `subway_station` | Metro/Subway stations |
// | `parking`        | Parking lots          |
