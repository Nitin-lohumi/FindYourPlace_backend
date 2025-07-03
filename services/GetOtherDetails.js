import axios from "axios";
const getRouteInfo = async (startLng, startLat, endLng, endLat) => {
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.ROUTE_OPENSOURCE_API}&start=${startLng},${startLat}&end=${endLng},${endLat}`;
    const res = await axios.get(url);
    const segment = res.data;
    return {
        distanceInKm: (segment.distance / 1000).toFixed(2),
        durationInMin: (segment.duration / 60).toFixed(1)
    };
};
export default getRouteInfo;
